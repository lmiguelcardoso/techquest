module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['react', 'react-native', 'unused-imports'],
  rules: {
    'no-unused-vars': 'off', // Desabilita a regra padrão do ESLint
    '@typescript-eslint/no-unused-vars': [
      'warn', // Define como "warning" para variáveis não utilizadas
      {
        argsIgnorePattern: '^_', // Permite argumentos iniciados com "_"
        varsIgnorePattern: '^_', // Permite variáveis iniciadas com "_"
      },
    ],
    'unused-imports/no-unused-imports': 'warn', // Remove imports não utilizados
    'react/react-in-jsx-scope': 'off', // Necessário para projetos com React 17+
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
