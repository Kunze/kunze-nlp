import assert = require('assert');
import Corpus = require("../src/Corpus");
import CorpusReader = require("../src/CorpusReaders/CorpusReader");
import Corpora = require("../src/Corpora");
import IReadFile = require("../src/IReadFile");
import sinon = require("sinon");
import TaggedToken = require("../src/TaggedToken");
import StartToken = require("../src/StartToken");
 
describe("Corpora", () => {
    let corpus1 = new Corpus("", new CorpusReader());
    let corpus2 = new Corpus("", new CorpusReader());

    it("must mix tokens from both corpus and return 12 tokens", (done) => {
        sinon.stub(corpus1, "readFile", () => {
            return new Promise<TaggedToken[]>((resolve) => {
                let tokens = [new StartToken(), new TaggedToken("Meu", "PROPRESS"), new TaggedToken("nome", "N"), new TaggedToken("é", "V"), new TaggedToken("Murilo", "NPROP"), new TaggedToken(".", "END")];

                resolve(tokens);
            })
        });

        sinon.stub(corpus2, "readFile", () => {
            return new Promise<TaggedToken[]>((resolve) => {
                let tokens = [new StartToken(), new TaggedToken("Meu", "PROPRESS"), new TaggedToken("sobrenome", "N"), new TaggedToken("é", "V"), new TaggedToken("Kunze", "NPROP"), new TaggedToken(".", "END")];

                resolve(tokens);
            })
        });

        let corpora = new Corpora(corpus1, corpus2);
        corpora.getTokens().then((tokens) => {
            assert.equal(tokens.length, 12);
            done();
        });
    });
});