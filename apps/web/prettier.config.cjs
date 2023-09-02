/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: false,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  bracketSpacing: true,
  printWidth: 80,
  trailingComma: 'none',
  quoteProps: 'preserve',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/utils/(.*)$',
    '^@/styles/(.*)$',
    '^@/(.*)$',
    '^[./]'
  ]
};

module.exports = config;
