import Counter = require("../Counters/Counter");
import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");

class TransitionDatabase {
    private _bigrams: Counter[] = [];

    public add(first: TaggedToken, second: TaggedToken) {
        let inDatabaseBigramCounter = this._bigrams.find(bigram => {
           return bigram.getId() == first.getTag(); 
        });
        
        if (inDatabaseBigramCounter) {
            inDatabaseBigramCounter.add(second);
        } else {
            let bigramCounter = new Counter(first.getTag());
            bigramCounter.add(second);
            
            this._bigrams.push(bigramCounter);
        }
    }

    public get(lastTag: string): Counter {
        return this._bigrams.find(bigram => {
            return bigram.getId() == lastTag;
        });
    }
}

export = TransitionDatabase;