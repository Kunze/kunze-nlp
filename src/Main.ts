import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");
import ParsedNode = require("./ParsedNode");

// console.log(JSON.stringify(new ParsedNode("", "S", [
//     new ParsedNode("A caça é ilegal mas o leão mata", "S", [
//         new ParsedNode("A caça", "NP", [
//             new ParsedNode("A", "ART"),
//             new ParsedNode("caça", "N")
//         ]),
//         new ParsedNode("é ilegal mas o leão mata", "VP", [
//             new ParsedNode("é ilegal", "VP", [
//                 new ParsedNode("é", "V"),
//                 new ParsedNode("ilegal", "ADJ"),
//             ]),
//             new ParsedNode("mas o leão mata", "CONJP", [
//                 new ParsedNode("mas", "KC"),
//                 new ParsedNode("o leão caça", "S", [
//                     new ParsedNode("o leão", "NP"),
//                     new ParsedNode("caça", "V")
//                 ])
//             ]),
//         ])
//     ]),
//     new ParsedNode(".", "END")
// ])));

DefaultQuestionGeneratorFactory.create().then((questionGenerator) => {
    DefaultViterbiTaggerFactory.create().generateModel().then(tagger => {
        console.time("tagger");

        let phrases = "A caça é ilegal mas o leão caça.";
        let tokens = tagger.tag(phrases);
        let text = new Text(tokens);

        for (let phrase of text.getPhrases()) {
            console.log("-".repeat(50));
            console.log(`Text: ${phrase.toString()} \n`)
            console.log("Questions:")

            for (let question of questionGenerator.generate(phrase.getTokens())) {
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
