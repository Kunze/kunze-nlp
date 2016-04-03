import TaggedToken = require("./TaggedToken");
import Counter = require("./PartOfSpeechTagger/Counters/Counter");

class ProbabilityToken extends TaggedToken {
    constructor(word: string, tag: string, private probability: number, private known: boolean) {
        super(word, tag);
    }

    public getProbability() {
        return this.probability;
    }

    public getKnown() {
        return this.known;
    }

    public applyTransition(counter: Counter) {
        let probability = counter.getTag(this.getTag()).getCount() / counter.getCount();

        this.probability *= probability;
    }

    public copy(): ProbabilityToken {
        return new ProbabilityToken(this.word, this.getTag(), this.probability, this.known);
    }
}

export = ProbabilityToken;