import Counter = require("./Counter");
import ProbabilityToken = require("../../PartOfSpeechTagger/ProbabilityToken");

class TransitionCounter extends Counter {
    constructor(private tag: string) {
        super(tag)
    }

    public getProbability(secondTag: string) {
        var transitionToSecondTag = this.getTag(secondTag);

        if (transitionToSecondTag) {
            return transitionToSecondTag.getCount() / this.getCount();
        }
    }
}

export = TransitionCounter;