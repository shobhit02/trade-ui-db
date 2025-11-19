module.exports = {
  root: true,
  ignorePatterns: ['dist', 'coverage'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.base.json',
        tsconfigRootDir: __dirname
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'eslint-config-prettier'
      ],
      rules: {}
    }
  ]
};
