module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: ['airbnb-typescript', 'prettier', 'prettier/@typescript-eslint', 'prettier/react'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.eslint.json',
        sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
        'import/prefer-default-export': ['off'],
        '@typescript-eslint/no-unused-vars': ['off'],
        'import/no-unresolved': ['off'],
        '@typescript-eslint/no-use-before-define': ['off'],
        'eol-last': ['error', 'always'],
    },
};
