// Jest configuration - environment variables loaded via dotenv-cli
module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["**/*.js", "!node_modules/**", "!tests/**"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  rootDir: ".",
};
