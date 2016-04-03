import TaggedToken = require("./TaggedToken");

interface IReadFile {
    readFile(): Promise<TaggedToken[]>;
}

export = IReadFile