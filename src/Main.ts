import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");
import DefaultCYKParserFactory = require("./Parser/Factory/DefaultCYKParserFactory");

let defaultViterbiTagger = DefaultViterbiTaggerFactory.create();
let questionGenerator = DefaultQuestionGeneratorFactory.create();
let parser = DefaultCYKParserFactory.create();

defaultViterbiTagger.generateModel().then(tagger => {
    console.time("tagger");
    
    let phrases = "O cachorro viu o homem no parque. Murilo Kunze gosta de programar.";
    let tokens = tagger.tag(phrases);
    let text = new Text(tokens);
    let grammar = `
S -> NP VP
NP -> NPROP | ART N | ART NP | ART NPROP | NP PP
VP -> V NP | V PP | V ADJ
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N | PREP V | PREP+ART V | PREP VP`;

    for (let phrase of text.getPhrases()) {
        console.log("-".repeat(50));
        console.log(`Text: ${phrase.toString()} \n`)
        console.log("Questions:")

        for(let question of questionGenerator.generate(phrase.getTokens())) {
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
