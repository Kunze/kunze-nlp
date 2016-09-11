import assert = require("assert");
import GrammarBuilder = require("../src/Parser/Grammar/GrammarBuilder");
import Grammar = require("../src/Parser/Grammar/Grammar");
import ParsedNode = require("../src/Parser/ParsedNode");

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

    it("ParsedNode[] To Grammar", () => {
        let nodes = [
            new ParsedNode("O cachorro viu o o homem no parque.", "S", [], [
                new ParsedNode("O cachorro", "NP", [], [
                    new ParsedNode("O", "ART", []),
                    new ParsedNode("cachorro", "N", [])
                ]),
                new ParsedNode("viu o homem no parque", "VP", [], [
                    new ParsedNode("viu", "V", []),
                    new ParsedNode("o homem no parque", "NP", [], [
                        new ParsedNode("o homem", "NP", [], [
                            new ParsedNode("o", "ART", []),
                            new ParsedNode("homem", "N", [])
                        ]),
                        new ParsedNode("no parque", "PP", [], [
                            new ParsedNode("no", "PREP+ART", []),
                            new ParsedNode("parque", "N", [])
                        ])
                    ])
                ])
            ])
        ];

        let expected = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP+ART N`.trim();

        let grammar = GrammarBuilder.fromParsedNodes(nodes);
        assert.equal(grammar.toString(), expected)
    });
});