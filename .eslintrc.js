module.exports = {
  "extends": [
    "airbnb",
    "prettier"
  ],
  "plugins": [
    "prettier"
  ],
  "env": {
    "jest": true
  },
  "rules": {
    "prettier/prettier": ["error", {
      "singleQuote": true,
      "trailingComma": "es5"
    }],
    "import/no-extraneous-dependencies": 1,
    "import/prefer-default-export": 1,
    "no-param-reassign": 0,
  }
}
