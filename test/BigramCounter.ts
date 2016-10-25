import assert = require("assert");
import TransitionCounter = require("../src/PartOfSpeechTagger/Counters/TransitionCounter");
import TaggedToken = require("../src/PartOfSpeechTagger/TaggedToken");

describe("BigramCounter", () => {
    it("Count correct", () => {
        let firstTag = new TaggedToken("O", "ART");
        let secondTag = new TaggedToken("Murilo", "NPROP");
        let newSecondTag = new TaggedToken("Brasil", "N");        
        let bigramCounter = new TransitionCounter(firstTag.getTag());
        bigramCounter.add(secondTag);
        bigramCounter.add(newSecondTag);
        
        assert.equal(bigramCounter.getTag("NPROP").getCount(), 1);
        assert.equal(bigramCounter.getTag("N").getCount(), 1);
    });
});