import Office from "@components/Office";
import { createClient } from "@lib/supabase/server";
import { Button } from "@nextui-org/react";
import { Mic } from "lucide-react";
import { FC } from "react";

interface pageProps {
  params: {
    case_id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("patientio_cases")
    .select("*")
    .eq("id", params.case_id)
    .single();
  if (error) {
    throw error.message;
  }

  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <div className=" h-screen w-screen relative">
      {/* <div className="w-full h-full absolute top-0 left-0 inset-0  z-[999] bg-black/50 backdrop-blur flex flex-col flex-grow justify-center items-center">
        <Button
          className=" text-white font-medium"
          color="primary"
          variant="shadow"
        >
          Start the meeting
        </Button>
      </div> */}
      <div className="  z-50 absolute top-4 left-4 text-xl text-white/70  p-2 rounded-lg text-center font-bold">
        <h1>Patiento AI - v0</h1>
      </div>
      <Office />
      <div className="  z-50 absolute bottom-0 left-0 bg-black/10 text-white backdrop-blur-lg    py-4 px-4  text-left w-full flex justify-between items-center">
        <div>
          {" "}
          <h1 className="font-semibold text-sm">Dr. Eslam Abdou</h1>
          <p className="text-xs opacity-80">
            Case 02 - {data.name} - {data.patient_age} years old.
          </p>
        </div>

        <div className="min-w-[50%] max-w-[50%] flex justify-center items-center gap-1">
          <input
            placeholder="You can type your questions to the patient..."
            className="w-[70%]  py-2 px-2 border-none ring-0 outline-none rounded-l-lg rounded-r-sm backdrop-blur-md bg-black/80"
          />
          <button className="px-2 py-2 rounded-l-sm rounded-r-lg bg-black/80 backdrop-blur-md">
            <Mic />
          </button>
        </div>
        <div>
          <h1 className="text-lg font-semibold">15:20</h1>
        </div>
      </div>

      {/* <div className="  z-[999] absolute top-4 right-4  text-white/70  p-2 rounded-lg text-left space-y-2">
        {data.mainComplains}
      </div> */}
    </div>
  );
};

export default page;
