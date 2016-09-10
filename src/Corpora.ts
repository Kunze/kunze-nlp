import IReadFile = require("./IReadFile");
import TaggedToken = require("./TaggedToken");
import Text = require("./Text");
import fs = require("fs");
import path = require("path");

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

                // var t: TaggedToken[] = [].concat.apply([], tokens);
                // let phrases = [];
                // let phrase = [];

                // for (let token of t) {
                //     phrase.push(token);
                //     if (token.isEndPoint()) {
                //         phrases.push(phrase);
                //         phrase = [];
                //     }
                // }

                // var json = JSON.stringify(phrases);

                // fs.writeFile(path.join(__dirname, `../../corpora/macmorpho-v3/train/macmorpho.json`), json, function (err) {
                //     if (err) {
                //         console.log(err)
                //     }
                //     else {
                //         console.log("sucesso");
                //     }
                // })
            });
        });

        return promise;
    }
}

export = Corpora;