import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");

interface ICorpusReader {
    read(text: string): TaggedToken[];
}

export = ICorpusReader;