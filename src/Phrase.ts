import ProbabilityToken = require("./PartOfSpeechTagger/ProbabilityToken");
import IString = require("./IString");

class Phrase implements IString {
    constructor(private _tokens: ProbabilityToken[]) {

    }

    public toString(): string {
        let result = [];
        for (let token of this._tokens) {
            result.push(token.getWord());
        }

        return result.join("");
    }

    public getTokens(ignoreBlankSpace: boolean = true): ProbabilityToken[] {
        if (ignoreBlankSpace) {
            return this._tokens.filter((token: ProbabilityToken) => {
                return !(token.isBlankSpace());
            });
        }

        return this._tokens;
    }

    public toJSON() {
        return {
            phrase: this.toString(),
            tokens: this._tokens
        };
    }
}

export = Phrase;