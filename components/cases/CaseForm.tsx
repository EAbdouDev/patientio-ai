"use client";
import useMode from "@zuztand/Mode";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NewCaseSchema } from "@schema";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@components/ui/textarea";
import { createClient } from "@lib/supabase/client";

interface CaseFormProps {
  userEmail: string | null | undefined;
}

const CaseForm: FC<CaseFormProps> = ({ userEmail }) => {
  const { isInstuctor, setIsInstuctor, isLoading, setIsLoading } = useMode();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(NewCaseSchema),
    defaultValues: {
      title: "",
      name: "",
      gender: "",
      mainComplains: "",
      patientHistory: "",
      familyHistory: "",
      medications: "",
      tests: "",
      cac: "",
      rac: "",
      age: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof NewCaseSchema>) => {
    setLoading(true);
    if (!userEmail) {
      setIsLoading(false);
      console.log("userEmail not found");
      return;
    }
    const { data, error } = await supabase.from("patientio_cases").insert({
      title: formData.title,
      name: formData.name,
      patient_gender: formData.gender,
      patient_age: formData.age,
      mainComplains: formData.mainComplains,
      patientHistory: formData.patientHistory,
      familyHistory: formData.familyHistory,
      medications: formData.medications,
      tests: formData.tests,
      cac: formData.cac,
      rac: formData.rac,
      created_by: userEmail,
    });

    if (error) {
      throw error.message;
    }
    setLoading(false);
    console.log("done");
  };

  const { pending } = useFormStatus();

  if (!isInstuctor && !isLoading) {
    router.push("/cases-manager");
  }
  return (
    <div className="w-full h-full px-6 py-4 mt-4">
      <Form {...form}>
        <form
          //@ts-expect-error
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="space-y-8">
            <div className="flex justify-between items-center gap-x-6 flex-wrap gap-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }: any) => (
                  <FormItem className="space-y-2 flex flex-col flex-1">
                    <FormLabel className="text-base">Case Title</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="Enter title"
                        className=" border-2 rounded-lg p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }: any) => (
                  <FormItem className="space-y-2 flex flex-col flex-1">
                    <FormLabel className="text-base">Patient name</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="John Doe"
                        className=" border-2 rounded-lg p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }: any) => (
                  <FormItem className="space-y-2 flex flex-col flex-1">
                    <FormLabel className="text-base">Age</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="number"
                        placeholder="Enter age"
                        className=" border-2 rounded-lg p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }: any) => (
                  <FormItem className="space-y-2 flex flex-col flex-1">
                    <FormLabel className="text-base">Gender</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className=" bg-gray-100 py-3 px-2 rounded-lg"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mainComplains"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">Main Complains</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter the patient main complains"
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientHistory"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">Patient History</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter patient history"
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="familyHistory"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">Family History</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter patient's family history"
                      className="text-base"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Your message will be copied to the support team.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medications"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">Medications</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter medications"
                      className="text-base"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Your message will be copied to the support team.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tests"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">Tests</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter tests"
                      className="text-base"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Your message will be copied to the support team.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cac"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Communication Assessment Criteria (CAC)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter CAC"
                      className="text-base"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Your message will be copied to the support team.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rac"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Report Assessment Criteria (RAC)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter RAC"
                      className="text-base"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Your message will be copied to the support team.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <button type="submit" className="w-full" disabled={pending}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default CaseForm;
