import ProbabilityToken = require("./PartOfSpeechTagger/ProbabilityToken");
import IString = require("./IString");
import Phrase = require("./Phrase");

class Text implements IString {
    private phrases: Phrase[] = [];

    constructor(phrases: ProbabilityToken[][]) {
        let phraseTokens = [];
        for (let phrase of phrases) {
            this.phrases.push(new Phrase(phrase));
        }
    }

    public toString(): string {
        let result = [];
        for (let phrase of this.phrases) {
            result.push(phrase.toString());
        }

        return result.join(" ");
    }

    public getPhrases(): Phrase[] {
        return this.phrases;
    }
}

export = Text;