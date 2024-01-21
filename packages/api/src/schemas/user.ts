import { z } from "zod";
import { nameSchema, usernameSchema } from "./auth";

export const bioSchema = z
  .string()
  .max(280, "Your bio must be no more than 280 characters long.");

export const updateUserSchema = z.object({
  username: usernameSchema.optional(),
  name: nameSchema.optional(),
  bio: bioSchema.optional(),
});
