import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");
import DefaultCYKParserFactory = require("./Parser/Factory/DefaultCYKParserFactory");

let defaultViterbiTagger = DefaultViterbiTaggerFactory.create();
// let questionGenerator = DefaultQuestionGeneratorFactory.create();
let parser = DefaultCYKParserFactory.create();


defaultViterbiTagger.generateModel().then(tagger => {
    console.time("tagger");
    
    let phrases = "O cachorro viu o homem no parque.";
    let tokens = tagger.tag(phrases);
    let text = new Text(tokens);
    let grammar = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N`;

    for (let phrase of text.getPhrases()) {
        let parsedNodes = parser.parse(phrase.getTokens(), grammar)
        
    //     for (let token of phrase.getTokens()) {
    //         console.log(`word:         ${token.getWord()}`);
    //         console.log(`tag:          ${token.getTag()}`);
    //         console.log(`known word:   ${token.getKnown()}`);
    //         console.log(`probability:  ${token.getProbability()}`);
    //         console.log("-----------------------------------------");
    //     }
    }
    console.timeEnd("tagger");
});
