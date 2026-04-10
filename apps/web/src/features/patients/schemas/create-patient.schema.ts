import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export type CreatePatientForm = z.infer<typeof createPatientSchema>;
