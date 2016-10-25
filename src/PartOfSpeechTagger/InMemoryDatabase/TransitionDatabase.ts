import Counter = require("../Counters/Counter");
import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");

class TransitionDatabase {
    private _collection: LokiCollection<Counter>;

    constructor(private _db: Loki) {
        this._collection = _db.getCollection<Counter>("transition");
    }

    public add(first: TaggedToken, second: TaggedToken) {
        let inDatabaseBigramCounter = this._collection.by("id", first.getTag());

        if (inDatabaseBigramCounter) {
            inDatabaseBigramCounter.add(second);
        } else {
            let bigramCounter = new Counter(first.getTag());
            bigramCounter.add(second);
            
            this._collection.insert(bigramCounter);
        }
    }

    public get(lastTag: string): Counter {
        return this._collection.by("id", lastTag);;
    }
}

export = TransitionDatabase;