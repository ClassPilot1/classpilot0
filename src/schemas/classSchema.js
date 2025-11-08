import { z } from "zod";

export const classSchema = z.object({
  name: z
    .string()
    .min(1, "Class name is required")
    .min(2, "Class name must be at least 2 characters")
    .max(100, "Class name must be less than 100 characters"),

  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),

  subject: z
    .string()
    .max(100, "Subject must be less than 100 characters")
    .optional()
    .or(z.literal("")),

  grade_level: z
    .number()
    .min(1, "Grade level must be at least 1")
    .max(12, "Grade level must be at most 12")
    .optional(),

  schedule: z
    .string()
    .max(255, "Schedule must be less than 255 characters")
    .optional()
    .or(z.literal("")),

  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .optional(),


  teacherId: z.string().optional(),
  _id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  students: z.array(z.any()).optional(),
  studentCount: z.number().optional(),
});