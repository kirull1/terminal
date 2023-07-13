module.exports = {
    env: {
        browser: true,
        node: true,
        es2020: true
    },
    extends: "eslint:recommended",
    overrides: [
        {
            env: {
                node: true,
            },
            files: [ "src/**/*.js", "src/*.js" ],
            parserOptions: {
                sourceType: "module",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script",
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
