import CorpusReader = require("../../src/CorpusReaders/CorpusReader");
import EntityCorpusReader = require("../../src/CorpusReaders/EntityCorpusReader");
import assert = require('assert');

describe("EntityCorpusReader", () => {
    it("Identify 4 people", () => {
        let corpusReader = new EntityCorpusReader("NPROP", ["PERSON"]);
        let text =
            `
Murilo Kunze
Barbara Aparecida Zils
José da Silva
Roberto Fernando Henrique da Silva
`;
        let tokens = corpusReader.read(text);

        assert.equal(tokens.length, 8); //START_ENTITY e o nome da pessoa
        assert(tokens[0].toString(), "Murilo Kunze_NPROP#PERSON");
        assert(tokens[1].toString(), "Barbara Aparecida Zils_NPROP#PERSON");
        assert(tokens[2].toString(), "José da Silva_NPROP#PERSON");
        assert(tokens[3].toString(), "Roberto Fernando Henrique da Silva_NPROP#PERSON");
    });
});