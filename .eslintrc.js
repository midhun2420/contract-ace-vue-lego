module.exports = {
    root : true,
    env  : {
        node : true
    },
    extends : [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions : {
        parser : 'babel-eslint'
    },
    rules : {
        'no-console'  : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger' : process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        semi                       : ['error', 'always'],
        indent                     : ['error', 4],
        'no-mixed-spaces-and-tabs' : ['error', 'smart-tabs'],

        'brace-style'             : ['error', '1tbs', { allowSingleLine : true }],
        'key-spacing'             : ['error', { align : 'colon', beforeColon : true }],
        'object-property-newline' : ['error', { allowAllPropertiesOnSameLine : true }],

        'array-element-newline' : ['error', 'consistent'],
        'array-bracket-newline' : ['error', 'consistent'],
        'array-bracket-spacing' : ['error', 'never']
    }
};
