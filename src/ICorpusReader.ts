import TaggedToken = require("./TaggedToken");

interface ICorpusReader {
    read(text: string): TaggedToken[];
}

export = ICorpusReader;