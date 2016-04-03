import IString = require("./IString");

class Token implements IString {
    constructor(protected word: string) {
        // <TODO> tratar aspas duplas e simples
        //this.word = _word.replace("\"", "").replace("'", "");
    }

    public getWord(): string {
        return this.word;
    }

    public isBlankSpace() {
        return /^\s*$/g.test(this.word);
    }

    public toLowerCase() {
        return this.word.toLowerCase();
    }
}

export = Token;