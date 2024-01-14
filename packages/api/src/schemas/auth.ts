import { z } from "zod";

export const signupValidator = z.object({
  username: z
    .string()
    .min(3, "Your username must be between 3 and 16 characters.")
    .max(16, "Your username must be between 3 and 16 characters.")
    .regex(
      /^[a-zA-Z0-9_]*$/,
      "Your username must only contain alphanumeric characters.",
    ),
  name: z
    .string()
    .min(1, "You must enter a name.")
    .max(32, "Your name must be no more than 32 characters."),
  password: z
    .string()
    .min(8, "Your password must be at least 8 characters.")
    .max(1024, "Your password must be no more than 1024 characters."),
});

export const loginValidator = z.object({
  username: z.string(),
  password: z.string().max(1024),
});
