module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:jsx-a11y/recommended"
    ],

    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import",
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
        ],
        "semi": [
            "error",
            "never"
        ],
        "react/jsx-uses-vars": [
            "error",
        ],
        "no-class-assign": [ // Too useful
            "off"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "no-console": [
            "warn",
        ],
        "comma-dangle": [
            "warn",
            "always-multiline"
        ],
        "eol-last": [
            "error",
        ]
    },
    "globals": {
        "google": false,
    }
};

