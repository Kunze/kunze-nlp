import assert = require("assert");
import ProbabilityToken = require("../src/ProbabilityToken");
import GrammarBuilder = require("../src/Parser/GrammarBuilder");
import GrammarRule = require("../src/GrammarRule");
import Grammar = require("../src/Grammar");
import ParsedNode = require("../src/ParsedNode");

describe("GrammarBuilder", () => {
    it("Parse into 4 rules", () => {
        let grammarText = `
S -> NP VP
NP -> NPROP
VP -> V | V PP
PP -> PREP V`;

        let grammar: Grammar = GrammarBuilder.fromText(grammarText);

        assert.equal(grammar.getRule(0).name, "S"); //S -> NP VP
        assert.equal(grammar.getRule(0).matches.length, 1);

        assert.equal(grammar.getRule(1).name, "NP"); //NP -> NPROP
        assert.equal(grammar.getRule(1).matches.length, 1);
        assert.equal(grammar.getRule(1).matches[0], "NPROP");

        assert.equal(grammar.getRule(2).name, "VP"); //VP -> V | V PP
        assert.equal(grammar.getRule(2).matches.length, 2);
        assert.equal(grammar.getRule(2).matches[0], "V");
        assert.equal(grammar.getRule(2).matches[1], "V PP");

        assert.equal(grammar.getRule(3).name, "PP"); //PP -> PREP V
        assert.equal(grammar.getRule(3).matches[0], "PREP V");
        assert.equal(grammar.getRule(3).matches.length, 1);
    });
});