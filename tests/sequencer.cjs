const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);

    return copyTests.sort((testA, testB) => {
      if (testA.path.includes("/setup/")) {
        return -1;
      }

      if (testB.path.includes("/setup/")) {
        return 1;
      }

      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;
