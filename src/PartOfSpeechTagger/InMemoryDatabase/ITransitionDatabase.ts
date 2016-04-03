import Counter = require("../Counters/Counter");
import TaggedToken = require("../../TaggedToken");

interface ITransitionDatabase {
    add(first: TaggedToken, second: TaggedToken);
    get(firstTag: string): Counter;
}

export = ITransitionDatabase;