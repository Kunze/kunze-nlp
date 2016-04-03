import IReadFile = require("./IReadFile");
import ICorpusReader = require("./ICorpusReader");
import TaggedToken = require("./TaggedToken");
import * as fs from "fs";

class Corpus implements IReadFile {
    constructor(
        private _filePath: string,
        private _reader: ICorpusReader) {
    }

    public readFile(options?): Promise<TaggedToken[]> {
        return new Promise<TaggedToken[]>((resolve, defer) => {
            fs.readFile(this._filePath, options || "utf-8", (error, data) => {
                //http://stackoverflow.com/questions/24356713/node-js-readfile-error-with-utf8-encoded-file-on-windows
                resolve(this._reader.read(data.replace(/^\uFEFF/, '')));
            });
        });
    }
}

export = Corpus