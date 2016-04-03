import CorpusReader = require("../src/CorpusReader");
import assert = require('assert');

describe("CorpusReader", () => {
    it("must generate 8 tokens", () => {
        let corpusReader = new CorpusReader();
        let text = "Sem_PREP constranger_V ,_PU comando_V homens_N livres_ADJ ._END";
        let tokens = corpusReader.read(text);
        //a primeira sempre é a START 
        assert.equal(tokens.length, 8);
    });

    it("must generate correct word and tags", () => {
        let corpusReader = new CorpusReader();
        let text = "Sem_PREP constranger_V ,_PU comando_V homens_N livres_ADJ ._END";
        let tokens = corpusReader.read(text);

        assert.equal(tokens[0].toString(), "_START");
        assert.equal(tokens[1].toString(), "Sem_PREP");
        assert.equal(tokens[2].toString(), "constranger_V");
        assert.equal(tokens[3].toString(), ",_PU");
        assert.equal(tokens[4].toString(), "comando_V");
        assert.equal(tokens[5].toString(), "homens_N");
        assert.equal(tokens[6].toString(), "livres_ADJ");
        assert.equal(tokens[7].toString(), "._END");
    });

    it("must identify PERSON", () => {
        let corpusReader = new CorpusReader();
        let text = "Meu_PROADJ nome_N é_V Murilo Kunze_N#PERSON._END";
        let tokens = corpusReader.read(text);

        assert.equal(tokens[0].toString(), "_START");
        assert.equal(tokens[1].toString(), "Meu_PROADJ");
        assert.equal(tokens[2].toString(), "nome_N");
        assert.equal(tokens[3].toString(), "é_V");
        assert.equal(tokens[4].toString(), "Murilo Kunze_N#PERSON");
        assert.equal(tokens[5].toString(), "._END");
    });
});