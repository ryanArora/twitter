/** @type {import("eslint").Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ["*.js", "*.cjs", "*.mjs", "*.jsx", "*.ts", "*.tsx"],
      overrides: [
        {
          files: ["*.ts", "*.tsx"],
          rules: {
            "@typescript-eslint/consistent-type-imports": [
              "error",
              { fixStyle: "inline-type-imports", prefer: "type-imports" },
            ],
            "import/consistent-type-specifier-style": [
              "error",
              "prefer-inline",
            ],
          },
        },
      ],
      rules: {
        "import/no-duplicates": "error",
        "import/order": [
          "error",
          {
            alphabetize: {
              caseInsensitive: true,
              order: "asc",
            },
            groups: ["builtin", "external", "internal", "index", "sibling"],
            "newlines-between": "never",
          },
        ],
      },
    },
  ],
  plugins: ["import"],
};
