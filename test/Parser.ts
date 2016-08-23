import assert = require("assert");
import IParser = require("../src/Parser/IParser");
import ParsedNode = require("../src/ParsedNode");
import CYKParser = require("../src/Parser/CYKParser");
import GrammarReader = require("../src/GrammarReader");
import ProbabilityToken = require("../src/ProbabilityToken");

describe("CYKParser", () => {
    it("parse into a tree", () => {
        let tokens = [
            createToken("O", "ART"),
            createBlankSpace(),
            createToken("cachorro", "N"),
            createBlankSpace(),
            createToken("viu", "V"),
            createBlankSpace(),
            createToken("o", "ART"),
            createBlankSpace(),
            createToken("homem", "N"),
            createBlankSpace(),
            createToken("no", "PREP+ART"),
            createBlankSpace(),
            createToken("parque", "N")
        ]

        let grammar = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N`;

        let grammarReader = new GrammarReader();
        let parser = new CYKParser(grammarReader);

        let sentences: ParsedNode[] = parser.parse(tokens, grammar);
        let sentence = sentences[0];
        assert.equal(sentence.getNodeName(), "S");

        let oCachorro = sentence.node(0);
        assert.equal(oCachorro.getNodeName(), "NP");
        assert.equal(oCachorro.toString(), "O cachorro");

        assert.equal(sentence.node(1).getNodeName(), "BLANK-SPACE");
        
        let viuOHomemNoParque = sentence.node(2);
        assert.equal(viuOHomemNoParque.getNodeName(), "VP");
        assert.equal(viuOHomemNoParque.toString(), "viu o homem no parque");

        let viu = viuOHomemNoParque.node(0);
        assert.equal(viu.getNodeName(), "V");
        assert.equal(viu.toString(), "viu");

        assert.equal(viuOHomemNoParque.node(1).getNodeName(), "BLANK-SPACE");

        let oHomemNoParque = viuOHomemNoParque.node(2);
        assert.equal(oHomemNoParque.getNodeName(), "NP");
        assert.equal(oHomemNoParque.toString(), "o homem no parque");

        let oHomem = oHomemNoParque.node(0);
        assert.equal(oHomem.getNodeName(), "NP");
        assert.equal(oHomem.toString(), "o homem");

        assert.equal(oHomemNoParque.node(1).getNodeName(), "BLANK-SPACE");

        let noParque = oHomemNoParque.node(2);
        assert.equal(noParque.getNodeName(), "PP");
        assert.equal(noParque.toString(), "no parque");
    });

    function createToken(word: string, tag: string) {
        return new ProbabilityToken(word, tag, 1, true);
    }

    function createBlankSpace() {
        return new ProbabilityToken(" ", "BLANK-SPACE", 1, true);
    }
});
