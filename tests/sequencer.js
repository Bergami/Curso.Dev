const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Cria uma cópia do array de testes
    const copyTests = Array.from(tests);

    return copyTests.sort((testA, testB) => {
      // Testes de setup rodam primeiro
      if (testA.path.includes("/setup/")) {
        return -1;
      }
      if (testB.path.includes("/setup/")) {
        return 1;
      }

      // Para os demais testes, mantém a ordem alfabética
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;
