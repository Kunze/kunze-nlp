import DefaultHmmTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultHmmTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import CorporaCYKParserFactory = require("./Parser/Factory/CorporaCYKParserFactory");
import Text = require("./Text");
import TaggedToken = require("./PartOfSpeechTagger/TaggedToken");

// import ParsedNode = require("./Parser/ParsedNode");
// console.log(JSON.stringify(new ParsedNode("A poluição dos rios e das florestas.", "NP", [], [
//     new ParsedNode("A", "ART", []),
//     new ParsedNode("poluição dos rios e das florestas.", "NP", [], [
//         new ParsedNode("poluição dos rios", "NP", [], [
//             new ParsedNode("poluição", "N", []),
//             new ParsedNode("dos rios", "PP", [], [
//                 new ParsedNode("dos", "PREP+ART", []),
//                 new ParsedNode("rios", "N", [])
//             ])
//         ]),
//         new ParsedNode("e das florestas.", "CONJUP", [], [
//             new ParsedNode("e", "KC", []),
//             new ParsedNode("das florestas", "PP", [], [
//                 new ParsedNode("das", "PREP+ART", []),
//                 new ParsedNode("florestas", "N", [])
//             ])
//         ])
//     ])
// ])));

let questionGenerator = DefaultQuestionGeneratorFactory.create();
CorporaCYKParserFactory.create().then((parser) => {
    DefaultHmmTaggerFactory.create().generateModel().then(tagger => {
        console.time("tagger");

        let phrases = "O leão caça a lebre mas a caça é ilegal. Muitas matas são protegidas por leis ambientais.";
        let tokens = tagger.tag(phrases.trim());
        let text = new Text(tokens);

        for (let phrase of text.getPhrases()) {
            console.log("-".repeat(50));
            console.log(`Text: ${phrase.toString()} \n`)
            console.log("Questions:")

            let cykTable = parser.parse(phrase.getTokens());

            for (let question of questionGenerator.generate(cykTable)) {
                console.log(question);
            }

            for (let token of phrase.getTokens()) {
                console.log("-".repeat(40));
                console.log(`word:         ${token.getWord()}`);
                console.log(`tag:          ${token.getTag()}`);
                console.log(`known word:   ${token.getKnown()}`);
                console.log(`probability:  ${token.getProbability()}`);

                if (token.hasAttributes()) {
                    console.log(`attribute:    ${token.getAttributes()}`);
                }
            }
        }
        console.timeEnd("tagger");
    });
});
