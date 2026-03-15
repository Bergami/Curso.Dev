module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!node_modules/**",
    "!tests/**",
    "!next-env.d.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  rootDir: ".",
  testSequencer: "./tests/sequencer.cjs",
};
