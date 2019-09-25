module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: [2, 4],
        semi: [2, 'never'],
        'no-underscore-dangle': [2, { allow: ['_id', '_vm'] }],
        'no-param-reassign': [2, { props: false }],
        'import/extensions': ['error', 'always', {
            js: 'never',
            vue: 'never',
        }],
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
    },
}
