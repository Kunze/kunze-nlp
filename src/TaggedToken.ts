import Token = require("./Token");

class TaggedToken extends Token {
    constructor(word: string, private tag: string) {
        super(word);
    }

    public getTag(): string {
        return this.tag;
    }

    public isStartTag() {
        return this.tag === "START";    
    }
    
    public isEndPoint(): boolean {
        return this.tag === "END";
    }

    public isBlankSpace(): boolean {
        return this.tag === "BLANK-SPACE";
    }

    public toString(): string {
        return this.word + "_" + this.tag;
    }
}

export = TaggedToken;