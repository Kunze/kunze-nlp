import DefaultHmmTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultHmmTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import CorporaCYKParserFactory = require("./Parser/Factory/CorporaCYKParserFactory");
import Text = require("./Text");
import TaggedToken = require("./PartOfSpeechTagger/TaggedToken");

let questionGenerator = DefaultQuestionGeneratorFactory.create();
CorporaCYKParserFactory.create().then((parser) => {
    DefaultHmmTaggerFactory.create().generateModel().then(tagger => {
        console.time("tagger");

        let phrases = "Murilo Kunze gosta de programar sozinho de noite. A aliança de ouro era bonita. A maça era vermelha. Murilo Kunze está apresentando o seu trabalho.";
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
            }
        }
        console.timeEnd("tagger");
    });
});
