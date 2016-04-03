import EmissionCounter = require("../Counters/EmissionCounter");
import TaggedToken = require("../../TaggedToken");

interface IEmissionDatabase {
    add(taggedToken: TaggedToken);
    get(word: string): EmissionCounter;
}

export = IEmissionDatabase;