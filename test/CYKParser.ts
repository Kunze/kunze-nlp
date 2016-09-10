import assert = require("assert");
import IParser = require("../src/Parser/Interfaces/IParser");
import CYKTable = require("../src/Parser/CYKTable");
import CYKParser = require("../src/Parser/CYKParser");
import ProbabilityToken = require("../src/PartOfSpeechTagger/ProbabilityToken");

describe("CYKParser", () => {
    it("Parse into a tree", () => {
        let tokens = [
            createToken("O", "ART"),
            createToken("cachorro", "N"),
            createToken("viu", "V"),
            createToken("o", "ART"),
            createToken("homem", "N"),
            createToken("no", "PREP+ART"),
            createToken("parque", "N")
        ]

        let grammar = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N`.trim();
        let parser = new CYKParser(grammar);
        let sentences: CYKTable = parser.parse(tokens);
        let sentence = sentences.getTrees()[0];

        let oCachorro = sentence.node(0);

        assert.equal(sentence.getTag(), "S");

        assert.equal(oCachorro.getTag(), "NP");
        assert.equal(oCachorro.toString(), "O cachorro");

        let viuOHomemNoParque = sentence.node(1);
        assert.equal(viuOHomemNoParque.getTag(), "VP");
        assert.equal(viuOHomemNoParque.toString(), "viu o homem no parque");

        let viu = viuOHomemNoParque.node(0);
        assert.equal(viu.getTag(), "V");
        assert.equal(viu.toString(), "viu");

        let oHomemNoParque = viuOHomemNoParque.node(1);
        assert.equal(oHomemNoParque.getTag(), "NP");
        assert.equal(oHomemNoParque.toString(), "o homem no parque");

        let oHomem = oHomemNoParque.node(0);
        assert.equal(oHomem.getTag(), "NP");
        assert.equal(oHomem.toString(), "o homem");

        let noParque = oHomemNoParque.node(1);
        assert.equal(noParque.getTag(), "PP");
        assert.equal(noParque.toString(), "no parque");
    });

    it("Incomplete tree", () => {
        let tokens = [
            createToken("O", "ART"),
            createToken("viu", "V"),
            createToken("homem", "N"),
            createToken("parque", "N")
        ]

        let grammar = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N`.trim();
        let parser = new CYKParser(grammar);
        let cykTable = parser.parse(tokens);

        //nenhuma árvore gerada para uma grmatica inválida
        assert.deepEqual(cykTable.getTrees(), undefined);
    });

    function createToken(word: string, tag: string) {
        return new ProbabilityToken(word, tag, [], 1, true);
    }
});
