import TaggedToken = require("../../TaggedToken");
import Counter = require("./Counter");
import MatchTag = require("./MatchTag");
import ProbabilityToken = require("../../ProbabilityToken");

class EmissionCounter extends Counter {
    constructor(private word: string) {
        super(word.toLowerCase())
    }

    //preciso do word pq o unigram grava tudo minusculo
    public getProbabilityTokens(word: string): ProbabilityToken[] {
        var probabilityTokens: ProbabilityToken[] = [];

        for (let tag of this.tags) {
            let probability = tag.getCount() / this.getCount();

            probabilityTokens.push(new ProbabilityToken(word, tag.getTag(), tag.getAttributes(), probability, true));
        }

        return probabilityTokens;
    }
}

export = EmissionCounter;