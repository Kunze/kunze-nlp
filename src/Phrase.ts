import ProbabilityToken = require("./ProbabilityToken");
import IString = require("./IString");

//verificar possibilidade de mudar o nome para 'Sentence' 
//e ignorar frases sem sujeito ou predicado
//http://www.eurocentres.com/blog/?p=1148
class Phrase implements IString {
    constructor(private _tokens: ProbabilityToken[]) {
        //toda frase termina em pontuação
        if (!(_tokens[_tokens.length - 1].isEndPoint())) {
            throw new Error("invalid phrase");
        }
    }

    public toString(): string {
        let result = [];
        for (let token of this._tokens) {
            result.push(token.getWord());
        }

        return result.join("");
    }

    public getTokens(ignoreBlankSpace?: boolean): ProbabilityToken[] {
        if (ignoreBlankSpace === true || ignoreBlankSpace === undefined || ignoreBlankSpace === null) {
            return this._tokens.filter((token: ProbabilityToken) => {
                return !(token.isBlankSpace());
            });
        }

        return this._tokens;
    }

    public getProbability() {
        return this._tokens.reduce((previous, current, index, array) => {
            return previous * current.getProbability();
        }, 1);
    }

    public toJSON() {
        return {
            phrase: this.toString(),
            probability: this.getProbability(),
            tokens: this._tokens
        };
    }
}

export = Phrase;