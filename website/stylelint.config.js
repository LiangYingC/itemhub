module.exports = {
    extends: [
        'stylelint-config-standard'
    ],
    // add your custom config here
    // https://stylelint.io/user-guide/configuration
    rules: {
        indentation: [
            4,
            {
                message: 'Please use 4 spaces for indentation.',
                severity: 'warning'
            }
        ],
        'at-rule-no-unknown': [true, {
            ignoreAtRules: ['extend']
        }],
        'no-descending-specificity': null
    }
};
