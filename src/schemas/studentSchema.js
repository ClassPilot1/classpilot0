import { z } from "zod";

export const studentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  age: z
    .number()
    .min(5, "Age must be at least 5")
    .max(25, "Age must be at most 25"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters"),

  gender: z
    .union([
      z.string().max(20, "Gender must be less than 20 characters"),
      z.literal(""),
    ])
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),

  parentEmail: z
    .union([
      z.string().email("Invalid email format").max(255, "Parent email must be less than 255 characters"),
      z.literal(""),
    ])
    .optional(),

  parentPhone: z
    .union([
      z.string().max(20, "Parent phone must be less than 20 characters"),
      z.literal(""),
    ])
    .optional(),

  teacherId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const genders = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say"
];
