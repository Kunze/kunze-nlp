import assert = require("assert");
import ProbabilityToken = require("../src/ProbabilityToken");
import GrammarReader = require("../src/GrammarReader");
import GrammarRule = require("../src/GrammarRule");
import GrammarRulesProxy = require("../src/GrammarRulesProxy");

describe("GrammarReader", () => {
    it("should parse into 4 rules", () => {
        let grammar = `
S -> NP VP
NP -> NPROP
VP -> V | V PP
PP -> PREP V`;

        let grammarParser = new GrammarReader();
        let grammarRules: GrammarRulesProxy = grammarParser.parse(grammar);

        assert.equal(grammarRules.grammar(0).name, "S"); //S -> NP VP
        assert.equal(grammarRules.grammar(0).matches.length, 1);

        assert.equal(grammarRules.grammar(1).name, "NP"); //NP -> NPROP
        assert.equal(grammarRules.grammar(1).matches.length, 1);
        assert.equal(grammarRules.grammar(1).matches[0], "NPROP");

        assert.equal(grammarRules.grammar(2).name, "VP"); //VP -> V | V PP
        assert.equal(grammarRules.grammar(2).matches.length, 2);
        assert.equal(grammarRules.grammar(2).matches[0], "V");
        assert.equal(grammarRules.grammar(2).matches[1], "V PP");

        assert.equal(grammarRules.grammar(3).name, "PP"); //PP -> PREP V
        assert.equal(grammarRules.grammar(3).matches[0], "PREP V");
        assert.equal(grammarRules.grammar(3).matches.length, 1);
    });
});