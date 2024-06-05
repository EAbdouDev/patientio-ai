"use client";
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import { createClient } from "@lib/supabase/client";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

const SpeechRecognitionComponent = () => {
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcripts, setTranscripts] = useState<
    { text: string | undefined; confidence: number; ai?: boolean }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; parts: { text: string }[] }[]
  >([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const supbase = createClient();
  const [audioURL, setAudioURL] = useState<any>(null);

  useEffect(() => {
    if (listening) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const newTranscript = {
          text: lastResult[0].transcript,
          confidence: lastResult[0].confidence,
        };
        setTranscripts((prevTranscripts) => {
          const updatedTranscripts = [...prevTranscripts, newTranscript];
          fetchGeminiResponse(newTranscript.text);
          return updatedTranscripts;
        });
      };

      recognitionRef.current.start();

      recognitionRef.current.onend = () => {
        if (listening) {
          recognitionRef.current?.start();
        }
      };

      return () => {
        recognitionRef.current?.stop();
        recognitionRef.current = null;
      };
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    }
  }, [listening]);

  const startListening = () => {
    setListening(true);
  };

  const stopListening = () => {
    setListening(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim() !== "") {
        const newTranscript = { text: chatInput.trim(), confidence: 1 };
        setTranscripts((prevTranscripts) => [
          ...prevTranscripts,
          newTranscript,
        ]);
        fetchGeminiResponse(chatInput.trim());
        setChatInput("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  const fetchGeminiResponse = async (text: string) => {
    setLoading(true);

    // Fetch the case data from Supabase
    // const caseResponse = await fetch('/api/getCase');
    // const caseData = await caseResponse.json();

    const { data: caseData, error } = await supbase
      .from("patientio_cases")
      .select("*");

    if (error) {
      throw error.message;
    }

    // Create the prompt
    const prompt = {
      action: "simulate_patient",
      data: {
        introduction_and_rapport_building: {
          greeting:
            "The student initiates the conversation with a friendly and professional greeting.",
          introduction:
            "The student introduces themselves and explains their role clearly.",
          establishing_comfort:
            "The student asks open-ended questions to make the patient feel comfortable and encourages them to share their concerns.",
        },
        active_listening_and_empathy: {
          listening_skills:
            "The student demonstrates active listening by nodding, making eye contact (if applicable), and providing verbal acknowledgments.",
          empathy:
            "The student shows empathy by acknowledging the patient's feelings and concerns.",
          clarification:
            "The student asks clarifying questions to ensure they understand the patient's statements correctly.",
        },
        effective_questioning: {
          open_ended_questions:
            "The student uses open-ended questions to gather detailed information.",
          closed_ended_questions:
            "The student appropriately uses closed-ended questions to confirm specific details.",
          follow_up_questions:
            "The student asks follow-up questions to delve deeper into the patient's responses.",
        },
        information_gathering_and_summarization: {
          comprehensive_information:
            "The student gathers comprehensive information about the patient's symptoms, history, and other relevant details.",
          summarization:
            "The student periodically summarizes the information provided by the patient to ensure accuracy and understanding.",
          patient_perspective:
            "The student seeks to understand the patient's perspective and incorporates it into their understanding.",
        },
        communication_style_and_professionalism: {
          clarity:
            "The student communicates clearly and avoids using medical jargon.",
          tone: "The student maintains a professional and compassionate tone throughout the conversation.",
          respect:
            "The student shows respect for the patient’s opinions and concerns.",
        },
        conclusion_and_next_steps: {
          summarizing_the_session:
            "The student summarizes the key points of the conversation.",
          next_steps:
            "The student explains the next steps clearly and answers any remaining questions.",
          closing:
            "The student closes the conversation politely and thanks the patient for their time.",
        },
      },
      patient_profile: {
        name: caseData[1].name,
        age: caseData[1].patient_age,
        gender: caseData[1].patient_gender,
        main_complains: caseData[1].mainComplains.split("\n"),
        medications: caseData[1].medications.split("\n"),
        patient_history: caseData[1].patientHistory.split("\n"),
        family_history: caseData[1].familyHistory.split("\n"),
        tests: caseData[1].tests.split("\n"),
      },
      instructions: [
        "Understand the case and play the role of the patient (Mohammed).",
        "Do not provide any information unless the student asks a question.",
        "If the student asks about anything not related to the case, respond with 'I don't know.'",
        "Answer all questions as Mohammed using the provided information.",
      ],
    };

    // Add the prompt to the conversation history
    const updatedHistory = [
      { role: "user", parts: [{ text }] },
      { role: "model", parts: [{ text: JSON.stringify(prompt) }] },
      ...conversationHistory,
    ];

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: updatedHistory,
      });

      const result = await chatSession.sendMessage(text);
      console.log(result);

      const aiResponseText = processResponse(result.response);
      const aiResponse = {
        text: aiResponseText,
        confidence: 1,
        ai: true,
      };

      setTranscripts((prevTranscripts) => [...prevTranscripts, aiResponse]);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", parts: [{ text }] },
        { role: "model", parts: [{ text: aiResponseText }] },
      ]);
      handleAudioFetch(aiResponseText, caseData[1].patient_gender);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };
  const processResponse = (response: any) => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(
          `This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`
        );
      }
      const candidate = response.candidates[0];
      if (hadBadFinishReason(candidate)) {
        throw new Error(`${formatBlockErrorMessage(response)}`);
      }
      return getText(candidate);
    } else if (response.promptFeedback) {
      throw new Error(
        `Text not available. ${formatBlockErrorMessage(response)}`
      );
    }
    return "";
  };

  const hadBadFinishReason = (candidate: any) => {
    return false;
  };

  const formatBlockErrorMessage = (response: any) => {
    return "Blocked content";
  };

  const getText = (candidate: any) => {
    if (
      candidate.content &&
      candidate.content.parts &&
      candidate.content.parts.length > 0
    ) {
      return candidate.content.parts[0].text;
    }
    return candidate.text ? candidate.text() : "";
  };

  const textToSpeech = async (inputText: any, gender: string) => {
    // Set the API key for ElevenLabs API.
    // Do not use directly. Use environment variables.
    const API_KEY = "a8a469e90d11865d91b81009dfbcf085";
    // Set the ID of the voice to be used.
    const VOICE_ID =
      gender === "male" ? "JXWoTxxRdFLrympQ3Au5" : "1MD5F8kHIDMZ9LviKfZx";

    // Set options for the API request.
    const options = {
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        accept: "audio/mpeg", // Set the expected response type to audio/mpeg.
        "content-type": "application/json", // Set the content type to application/json.
        "xi-api-key": `${API_KEY}`, // Set the API key in the headers.
      },
      data: {
        text: inputText, // Pass in the inputText as the text to be converted to speech.
      },
      responseType: "arraybuffer", // Set the responseType to arraybuffer to receive binary data as response.
    };

    // Send the API request using Axios and wait for the response.
    const speechDetails = await axios.request(options);

    // Return the binary audio data received from the API response.
    return speechDetails.data;
  };

  const handleAudioFetch = async (text: any, gender: string) => {
    // Call the textToSpeech function to generate the audio data for the text "Hello welcome"
    const data = await textToSpeech(text, gender);
    // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
    const blob = new Blob([data], { type: "audio/mpeg" });
    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);
    // Set the audio URL state variable to the newly created URL
    setAudioURL(url);

    // Create a new audio element for playback
    const newAudio = new Audio(url);

    // Handle audio playback events (optional)
    newAudio.addEventListener("play", () => {
      console.log("Audio playback started");
    });
    newAudio.addEventListener("ended", () => {
      console.log("Audio playback ended");
    });

    // Play the audio with appropriate handling for autoplay restrictions
    try {
      await newAudio.play(); // Attempt to play with promise-based approach
    } catch (error) {
      console.warn(error);
      // Provide a visual cue or alternative playback option (e.g., play button)
    }

    // Optionally store the audio element for potential cleanup
    // (consider using useEffect with a cleanup function for this)

    // Provide a visual cue or alternative playback option (e.g., play button)
  };

  return (
    <div className="mt-20 max-w-3xl mx-auto p-6 rounded-lg">
      <button
        onClick={listening ? stopListening : startListening}
        className="w-[200px] h-fit py-4 px-2 bg-blue-500 rounded-lg text-white font-semibold disabled:opacity-50"
      >
        {listening ? "Stop" : "Speak"}
      </button>
      <div className="mt-4">
        <div className="mt-4 mb-2">
          <textarea
            value={chatInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={3}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        {loading && <p>Loading...</p>}
        {transcripts.length > 0 ? (
          <ul className="space-y-2">
            {transcripts.map((transcript, index) => (
              <li
                key={`${transcript.text}-${index}`}
                className={`text-lg rounded-xl ${
                  transcript.ai ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                {transcript.ai ? (
                  <span>
                    <p className="w-full border-b border-blue-200 mb-2 flex justify-start items-center gap-2 font-bold p-2">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      Gemini pro 1.5
                    </p>
                    <ReactMarkdown className="leading-relaxed px-4 py-2">
                      {transcript.text}
                    </ReactMarkdown>
                  </span>
                ) : (
                  <p>
                    <p className="w-full border-b mb-2 font-bold p-2">You</p>
                    <p className="px-4 py-2">{transcript.text}</p>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Start Talking</p>
        )}
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
