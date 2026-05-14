import { z } from "zod";

/** Keep aligned with `packages/shared/src/auth-schemas.ts`. */
export const signupSchema = z.object({
  name: z.string().max(80).optional(),
  email: z
    .string()
    .min(3)
    .max(255)
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128)
    .regex(/[A-Za-z]/, "Include a letter.")
    .regex(/[0-9]/, "Include a number."),
});

export const loginSchema = z.object({
  email: z.string().min(3).max(255).email("Enter a valid email address."),
  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(3).max(255).email("Enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(16).max(256),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128)
    .regex(/[A-Za-z]/, "Include a letter.")
    .regex(/[0-9]/, "Include a number."),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(20),
});
