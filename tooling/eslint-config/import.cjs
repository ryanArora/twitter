/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ["import"],
  overrides: [
    {
      files: ["*.js", "*.cjs", "*.mjs", "*.jsx", "*.ts", "*.tsx"],
      rules: {
        "import/no-duplicates": "error",
        "import/order": [
          "error",
          {
            groups: ["builtin", "external", "internal", "index", "sibling"],
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
            "newlines-between": "never",
          },
        ],
      },
      overrides: [
        {
          files: ["*.ts", "*.tsx"],
          rules: {
            "@typescript-eslint/consistent-type-imports": [
              "error",
              { prefer: "type-imports", fixStyle: "inline-type-imports" },
            ],
            "import/consistent-type-specifier-style": [
              "error",
              "prefer-inline",
            ],
          },
        },
      ],
    },
  ],
};
