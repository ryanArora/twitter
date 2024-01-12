/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import baseConfig from "@repo/tailwind-config";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
} satisfies Config;
