import DefaultHmmTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultHmmTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import CorporaCYKParserFactory = require("./Parser/Factory/CorporaCYKParserFactory");
import Text = require("./Text");
import TaggedToken = require("./PartOfSpeechTagger/TaggedToken");

// import ParsedNode = require("./Parser/ParsedNode");
// console.log(JSON.stringify(new ParsedNode("Em muitos locais do brasil.", "PP", [], [
//         new ParsedNode("Em", "PREP", [], []),
//         new ParsedNode("muitos locais do brasil.", "NP", [], [
//             new ParsedNode("muitos", "PROSUB", []),
//             new ParsedNode("locais do brasil.", "NP", []),
//         ]),
//     ])
// ));

let questionGenerator = DefaultQuestionGeneratorFactory.create();
CorporaCYKParserFactory.create().then((parser) => {
    DefaultHmmTaggerFactory.create().generateModel().then(tagger => {
        console.time("tagger");

        let phrases = "Logo, ao comprar produtos derivados da madeira, procure por esse selo.";
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
