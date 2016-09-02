import assert = require("assert");
import ParsedNode = require("../src/ParsedNode");
import GrammarBuilder = require("../src/Parser/GrammarBuilder");

describe("GrammarBuilder", () => {
    it("ParsedNode[] To Grammar", () => {
        let nodes = [
            new ParsedNode("O cachorro viu o o homem no parque.", "S", [
                new ParsedNode("O cachorro", "NP", [
                    new ParsedNode("O", "ART"),
                    new ParsedNode("cachorro", "N")
                ]),
                new ParsedNode("viu o homem no parque", "VP", [
                    new ParsedNode("viu", "V"),
                    new ParsedNode("o homem no parque", "NP", [
                        new ParsedNode("o homem", "NP", [
                            new ParsedNode("o", "ART"),
                            new ParsedNode("homem", "N")
                        ]),
                        new ParsedNode("no parque", "PP", [
                            new ParsedNode("no", "PREP+ART"),
                            new ParsedNode("parque", "N")
                        ])
                    ])
                ])
            ])
        ];

        let expected = `
S -> NP VP
NP -> ART N | NP PP | ART N
VP -> V NP
PP -> PREP+ART N`.trim();

        let grammarRulesProxy = GrammarBuilder.fromParsedNodes(nodes);
        assert.equal(grammarRulesProxy.toGrammar(), expected)
    });
});
