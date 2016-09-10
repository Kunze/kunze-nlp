import TaggedToken = require("./PartOfSpeechTagger/TaggedToken");

interface IReadFile {
    readFile(): Promise<TaggedToken[]>;
}

export = IReadFile