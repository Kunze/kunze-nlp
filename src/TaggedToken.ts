import Token = require("./Token");

class TaggedToken extends Token {
    constructor(word: string, private tag: string, private entity?: string) {
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

    public isEntity(): boolean {
        return this.entity !== undefined;
    }

    public toString(): string {
        if (this.isEntity()) {
            return this.word + "_" + this.tag + "#" + this.entity;
        }
        
        return this.word + "_" + this.tag;
    }
}

export = TaggedToken;