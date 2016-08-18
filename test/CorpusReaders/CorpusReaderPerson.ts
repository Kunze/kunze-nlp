import CorpusReader = require("../../src/CorpusReaders/CorpusReader");
import CorpusReaderPerson = require("../../src/CorpusReaders/CorpusReaderPerson");
import assert = require('assert');

describe("CorpusReaderPerson", () => {
    it("must identify 4 people", () => {
        let corpusReader = new CorpusReaderPerson();
        let text = 
`
Murilo Kunze
Barbara Aparecida Zils
José da Silva
Roberto Fernando Henrique da Silva
`;

        let tokens = corpusReader.read(text);

        assert.equal(tokens.length, 12); //tem um START e END para cade pessoa
        assert(tokens[0].toString(), "Murilo Kunze_NPROP#PERSON");
        assert(tokens[1].toString(), "Barbara Aparecida Zils_NPROP#PERSON");
        assert(tokens[2].toString(), "José da Silva_NPROP#PERSON");
        assert(tokens[3].toString(), "Roberto Fernando Henrique da Silva_NPROP#PERSON");
    });
});