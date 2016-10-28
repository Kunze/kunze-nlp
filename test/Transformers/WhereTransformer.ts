import assert = require("assert");
import WhereTransformer = require("../../src/QuestionGenerator/Transformers/WhereTransformer");
import ParsedNode = require("../../src/Parser/ParsedNode");

describe("WhereTransformer", () => {
    it("Generate a WHERE question", () => {
        let node = new ParsedNode("Murilo viajou para a Espanha.", "S", [], [
            new ParsedNode("Murilo", "NP", [], [
                new ParsedNode("Murilo", "NPROP", [])
            ]),
            new ParsedNode("viajou para a Espanha.", "VP", [], [
                new ParsedNode("viajou", "V", []),
                new ParsedNode("para a Espanha", "PP", ["LOCAL"], [
                    new ParsedNode("para", "PREP", []),
                    new ParsedNode("a Espanha.", "NP", ["LOCAL"], [
                        new ParsedNode("a", "ART", []),
                        new ParsedNode("Espanha.", "NP", [], [
                            new ParsedNode("Espanha.", "NPROP", [])
                        ])
                    ])
                ])
            ])
        ]);

        var whereTransformer = new WhereTransformer();
        var questions = whereTransformer.extract(node);

        assert.equal(questions[0], "Para onde Murilo viajou?")
    });
});
