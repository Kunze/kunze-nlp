import IReadFile = require("./IReadFile");
import TaggedToken = require("./TaggedToken");

class Corpora {
    private _corpora: IReadFile[];

    constructor(...corpus: IReadFile[]) {
        this._corpora = corpus;
    }

    public getTokens(): Promise<TaggedToken[]> {
        let promise = new Promise<TaggedToken[]>((resolve, reject) => {
            let promises = this._corpora.map((corpus) => {
                return corpus.readFile();
            });

            Promise.all(promises).then((tokens) => {
                resolve([].concat.apply([], tokens));
            });
        });

        return promise;
    }
}

export = Corpora