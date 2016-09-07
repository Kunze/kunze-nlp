import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import CorporaCYKParserFactory = require("./Parser/Factory/CorporaCYKParserFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");
import ParsedNode = require("./ParsedNode");

let questionGenerator = DefaultQuestionGeneratorFactory.create();
CorporaCYKParserFactory.create().then((parser) => {
    DefaultViterbiTaggerFactory.create().generateModel().then(tagger => {
        console.time("tagger");

        let phrases = "Murilo Kunze gosta de programar e caminhar.";
        let tokens = tagger.tag(phrases);
        let text = new Text(tokens);

        for (let phrase of text.getPhrases()) {
            console.log("-".repeat(50));
            console.log(`Text: ${phrase.toString()} \n`)
            console.log("Questions:")

            let parsedNodes = parser.parse(phrase.getTokens());

            for (let question of questionGenerator.generate(parsedNodes)) {
                console.log(question);
            }

            for (let token of phrase.getTokens()) {
                console.log("-".repeat(40));

                console.log(`word:         ${token.getWord()}`);
                console.log(`tag:          ${token.getTag()}`);
                console.log(`known word:   ${token.getKnown()}`);
                console.log(`probability:  ${token.getProbability()}`);
            }
        }
        console.timeEnd("tagger");
    });
});
