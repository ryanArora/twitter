/** @type {import("eslint").Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ["*.js", "*.cjs"],
      plugins: ["@typescript-eslint", "import"],
      extends: [
        "eslint:recommended",
        "./import.cjs",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
      },
      overrides: [
        {
          files: ["*.mjs"],
          parserOptions: {
            sourceType: "module",
          },
        },
      ],
    },
    {
      files: ["*.jsx"],
      plugins: ["@typescript-eslint", "import", "react", "react-hooks"],
      extends: [
        "eslint:recommended",
        "./import.cjs",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint", "import"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "./import.cjs",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
    },
    {
      files: ["*.tsx"],
      plugins: ["@typescript-eslint", "import", "react", "react-hooks"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "./import.cjs",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "prettier",
        "./typescript-compat.cjs",
        "./overrides.cjs",
      ],
    },
  ],
};
