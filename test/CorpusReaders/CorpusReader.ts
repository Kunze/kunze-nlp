import CorpusReader = require("../../src/CorpusReaders/CorpusReader");
import assert = require('assert');

describe("CorpusReader", () => {
    it("Generate 8 tokens", () => {
        let corpusReader = new CorpusReader();
        let text = "Sem_PREP constranger_V ,_PU comando_V homens_N livres_ADJ ._END";
        let tokens = corpusReader.read(text);
        //a primeira sempre é a START 
        assert.equal(tokens.length, 8);
    });

    it("Generate correct word and tags", () => {
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

    it("Identify PERSON", () => {
        let corpusReader = new CorpusReader();
        let text = "Meu_PROADJ nome_N é_V Murilo Kunze_NPROP#PERSON._END";
        let tokens = corpusReader.read(text);

        assert.equal(tokens[0].toString(), "_START");
        assert.equal(tokens[1].toString(), "Meu_PROADJ");
        assert.equal(tokens[2].toString(), "nome_N");
        assert.equal(tokens[3].toString(), "é_V");
        assert.equal(tokens[4].toString(), "Murilo Kunze_NPROP#PERSON");
        assert.equal(tokens[5].toString(), "._END");
    });

    it("Identify a LOCATION", () => {
        let corpusReader = new CorpusReader();
        let text = "Ele_PROPESS mora_V no_PREP+ART Rio de Janeiro_N#LOCATION._END";
        let tokens = corpusReader.read(text);

        assert.equal(tokens[0].toString(), "_START");
        assert.equal(tokens[1].toString(), "Ele_PROPESS");
        assert.equal(tokens[2].toString(), "mora_V");
        assert.equal(tokens[3].toString(), "no_PREP+ART");
        assert.equal(tokens[4].toString(), "Rio de Janeiro_N#LOCATION");
        assert.equal(tokens[5].toString(), "._END");
    });

    it("Identify a CHARACTER", () => {
        let corpusReader = new CorpusReader();
        let text = "O_ART gato de botas_N#CHARACTER é_V um_ART gato_N._END";
        let tokens = corpusReader.read(text);

        assert.equal(tokens[0].toString(), "_START");
        assert.equal(tokens[1].toString(), "O_ART");
        assert.equal(tokens[2].toString(), "gato de botas_N#CHARACTER");
        assert.equal(tokens[3].toString(), "é_V");
        assert.equal(tokens[4].toString(), "um_ART");
        assert.equal(tokens[5].toString(), "gato_N");
        assert.equal(tokens[6].toString(), "._END");
    });

    it("Read entities", () => {
        let corpusReader = new CorpusReader();
        let text = "O_ART Murilo_NPROP Kunze_NPROP é_V programador_N._END";
        let tokens = corpusReader.read(text);

        assert.equal(tokens[0].toString(), "_START");
        assert.equal(tokens[1].toString(), "O_ART");
        assert.equal(tokens[2].toString(), "Murilo Kunze_NPROP");
        assert.equal(tokens[3].toString(), "é_V");
        assert.equal(tokens[4].toString(), "programador_N");
        assert.equal(tokens[5].toString(), "._END");
    });
});