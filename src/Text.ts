import ProbabilityToken = require("./PartOfSpeechTagger/ProbabilityToken");
import IString = require("./IString");
import Phrase = require("./Phrase");

class Text implements IString {
    private phrases: Phrase[] = [];

    constructor(tokens: ProbabilityToken[]) {
        let phraseTokens = [];
        for (let token of tokens) {
            phraseTokens.push(token);

            if (token.isEndPoint()) {
                this.phrases.push(new Phrase(phraseTokens));
                phraseTokens = [];
            }
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