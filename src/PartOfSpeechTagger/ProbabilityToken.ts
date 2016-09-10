import TaggedToken = require("./TaggedToken");

class ProbabilityToken extends TaggedToken {
    constructor(word: string, tag: string, attributes: string[], private probability: number, private known: boolean) {
        super(word, tag, attributes);
    }

    public getProbability() {
        return this.probability;
    }

    public getKnown() {
        return this.known;
    }

    public applyTransition(probability: number) {
        this.probability *= probability;
    }

    public copy(): ProbabilityToken {
        return new ProbabilityToken(this.word, this.getTag(), this.getAttributes(), this.probability, this.known);
    }
}

export = ProbabilityToken;