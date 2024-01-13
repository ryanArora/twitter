import { z } from "zod";

export const signupValidator = z.object({
  username: z.string().min(3).max(16),
  password: z.string().min(8).max(1024),
});

export const loginValidator = z.object({
  username: z.string(),
  password: z.string().max(1024),
});
