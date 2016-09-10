import TaggedToken = require("../TaggedToken");
import StartToken = require("../StartToken");
import ICorpusReader = require("../ICorpusReader");

class JSONCorpusReader implements ICorpusReader {
    public read(text: string): TaggedToken[] {
        let phrases = JSON.parse(text);
        let taggedTokens = [];
        for (let phrase of phrases) {
            for (let token of phrase) {
                taggedTokens.push(new TaggedToken(token.word, token.tag, token.attributes));
            }
        }

        return taggedTokens;
    }
}

export = JSONCorpusReader;