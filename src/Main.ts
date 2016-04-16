import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");

let defaultViterbiTagger = DefaultViterbiTaggerFactory.create();
let questionGenerator = DefaultQuestionGeneratorFactory.create();

defaultViterbiTagger.generateModel().then(tagger => {
    console.time("tagger");
    
    let phrases = "Murilo Kunze gosta de programar.";
    let tokens = tagger.tag(phrases);
    let text = new Text(tokens);

    for (let phrase of text.getPhrases()) {
        console.log(phrase.toString(), `\nProbability: ${phrase.getProbability()}\n`);

        console.log("Questions:")
        for (let question of questionGenerator.generate(phrase.getTokens(false))) {
            console.log(question.toString());
        }
        console.log("-------------------------------------------\n");

        for (let token of phrase.getTokens()) {
            console.log(`word:         ${token.getWord()}`);
            console.log(`tag:          ${token.getTag()}`);
            console.log(`known word:   ${token.getKnown()}`);
            console.log(`probability:  ${token.getProbability()}`);
            console.log("-----------------------------------------");
        }
    }
    console.timeEnd("tagger");
});