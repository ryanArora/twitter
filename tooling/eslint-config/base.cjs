/** @type {import("eslint").Linter.Config} */
module.exports = {
  overrides: [
    {
      extends: [
        "eslint:recommended",
        "plugin:perfectionist/recommended-natural",
        "./import.cjs",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
      files: ["*.js", "*.cjs"],
      overrides: [
        {
          files: ["*.mjs"],
          parserOptions: {
            sourceType: "module",
          },
        },
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
      },
      plugins: ["@typescript-eslint", "perfectionist"],
    },
    {
      extends: [
        "eslint:recommended",
        "plugin:perfectionist/recommended-natural",
        "./import.cjs",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
      files: ["*.jsx"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "react", "react-hooks", "perfectionist"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:perfectionist/recommended-natural",
        "./import.cjs",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
      files: ["*.ts"],
      plugins: ["@typescript-eslint", "perfectionist"],
    },
    {
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:perfectionist/recommended-natural",
        "./import.cjs",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
      files: ["*.tsx"],
      plugins: ["@typescript-eslint", "react", "react-hooks", "perfectionist"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ],
};
