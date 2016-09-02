import assert = require("assert");
import ProbabilityToken = require("../src/ProbabilityToken");
import GrammarBuilder = require("../src/Parser/GrammarBuilder");
import GrammarRule = require("../src/GrammarRule");
import GrammarRulesProxy = require("../src/GrammarRulesProxy");
import ParsedNode = require("../src/ParsedNode");

describe("GrammarBuilder", () => {
    it("Parse into 4 rules", () => {
        let grammar = `
S -> NP VP
NP -> NPROP
VP -> V | V PP
PP -> PREP V`;

        let grammarRulesProxy: GrammarRulesProxy = GrammarBuilder.fromText(grammar);

        assert.equal(grammarRulesProxy.getRule(0).name, "S"); //S -> NP VP
        assert.equal(grammarRulesProxy.getRule(0).matches.length, 1);

        assert.equal(grammarRulesProxy.getRule(1).name, "NP"); //NP -> NPROP
        assert.equal(grammarRulesProxy.getRule(1).matches.length, 1);
        assert.equal(grammarRulesProxy.getRule(1).matches[0], "NPROP");

        assert.equal(grammarRulesProxy.getRule(2).name, "VP"); //VP -> V | V PP
        assert.equal(grammarRulesProxy.getRule(2).matches.length, 2);
        assert.equal(grammarRulesProxy.getRule(2).matches[0], "V");
        assert.equal(grammarRulesProxy.getRule(2).matches[1], "V PP");

        assert.equal(grammarRulesProxy.getRule(3).name, "PP"); //PP -> PREP V
        assert.equal(grammarRulesProxy.getRule(3).matches[0], "PREP V");
        assert.equal(grammarRulesProxy.getRule(3).matches.length, 1);
    });
});