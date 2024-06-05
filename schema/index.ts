import * as z from "zod";

export const NewCaseSchema = z.object({
  title: z
    .string({
      message: "Please enter a title",
    })
    .min(5, {
      message: "Title must be at least 6 characters long.",
    }),
  name: z.string().min(1, {
    message: "Please enter the patient name",
  }),
  age: z.string({ message: "Please enter the patient age" }),
  gender: z.enum(["male", "female"], {
    message: "Gender must be either 'male' or 'female'",
  }),
  mainComplains: z.string({
    message: "Please enter the main complains",
  }),
  patientHistory: z.string({
    message: "Please enter the patient history",
  }),
  familyHistory: z.string({
    message: "Please enter the family history",
  }),
  medications: z.string().optional().nullable(),
  tests: z.string().optional().nullable(),
  cac: z.string({
    message: "Please enter the communication assessment criteria",
  }),
  rac: z.string({
    message: "Please enter the report assessment criteria",
  }),
});
