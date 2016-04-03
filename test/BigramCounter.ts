import assert = require("assert");
import Counter = require("../src/PartOfSpeechTagger/Counters/Counter");
import TaggedToken = require("../src/TaggedToken");

describe("BigramCounter", () => {
    it("should count correct", () => {
        let firstTag = new TaggedToken("O", "ART");
        let secondTag = new TaggedToken("Murilo", "NPROP");
        let newSecondTag = new TaggedToken("Brasil", "N");        
        let bigramCounter = new Counter(firstTag.getTag());
        bigramCounter.add(secondTag);
        bigramCounter.add(newSecondTag);
        
        assert.equal(bigramCounter.getTag("NPROP").getCount(), 1);
        assert.equal(bigramCounter.getTag("N").getCount(), 1);
    });
});