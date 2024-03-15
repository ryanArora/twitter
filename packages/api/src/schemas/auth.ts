import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Your username must be between 3 and 16 characters.")
  .max(16, "Your username must be between 3 and 16 characters.")
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Your username must only contain alphanumeric characters.",
  );

export const nameSchema = z
  .string()
  .min(1, "You must enter a name.")
  .max(32, "Your name must be no more than 32 characters.");

export const passwordSchema = z
  .string()
  .min(8, "Your password must be at least 8 characters.")
  .max(1024, "Your password must be no more than 1024 characters.");

export const signupSchema = z.object({
  name: nameSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const loginSchema = z.object({
  password: z.string().max(1024),
  username: z.string(),
});
