import TransitionCounter = require("../Counters/TransitionCounter");
import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");

class TransitionDatabase {
    private _collection: LokiCollection<TransitionCounter>;

    constructor(private _db: Loki) {
        this._collection = _db.getCollection<TransitionCounter>("transition");
    }

    public add(first: TaggedToken, second: TaggedToken) {
        let inDatabaseBigramCounter = this._collection.by("id", first.getTag());

        if (inDatabaseBigramCounter) {
            inDatabaseBigramCounter.add(second);
        } else {
            let bigramCounter = new TransitionCounter(first.getTag());
            bigramCounter.add(second);
            
            this._collection.insert(bigramCounter);
        }
    }

    public get(lastTag: string): TransitionCounter {
        return this._collection.by("id", lastTag);;
    }
}

export = TransitionDatabase;