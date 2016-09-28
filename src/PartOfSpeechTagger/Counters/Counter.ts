import MatchTag = require("./MatchTag");
import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");

class Counter {
    private count: number = 0;
    public tags: MatchTag[] = [];

    constructor(protected id: string) {

    }

    public getId() {
        return this.id;
    }

    public getCount() {
        return this.count;
    }

    private addOne() {
        this.count++;
    }

    public getTags() {
        return this.tags;
    }

    public getTag(tag: string): MatchTag {
        let t: MatchTag;
        for (t of this.tags) {
            if (t.getTag() === tag) {
                return t;
            }
        }
    }

    public add(taggedToken: TaggedToken) {
        this.addOne();

        var match = this.tags.find(m => {
            return m.getTag() == taggedToken.getTag();
        });

        if (match) {
            match.addOne();
            match.addAttributes(taggedToken.getAttributes());
        }
        else {
            this.tags.push(new MatchTag(taggedToken.getTag(), taggedToken.getAttributes()));
        }
    }

    public getProbability(secondTag: string) {
        var transitionToSecondTag = this.getTag(secondTag);

        if (transitionToSecondTag) {
            return transitionToSecondTag.getCount() / this.getCount();
        }
    }
}

export = Counter;