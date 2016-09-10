import EmissionCounter = require("../Counters/EmissionCounter");
import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");

class EmissionDatabase {
    private _collection: LokiCollection<EmissionCounter>;

    constructor(private _db: Loki) {
        this._collection = _db.getCollection<EmissionCounter>("emission");
    }

    public add(taggedToken: TaggedToken) {
        let index = taggedToken.toLowerCase();
        let inDatabaseUnigramCounter = this._collection.by("id", index);
        if (inDatabaseUnigramCounter) {
            inDatabaseUnigramCounter.add(taggedToken);
        } else {
            let unigram = new EmissionCounter(index);
            unigram.add(taggedToken);

            this._collection.insert(unigram);
        }
    }

    public get(word: string): EmissionCounter {
        return this._collection.by("id", word.toLowerCase());
    }
}

export = EmissionDatabase;