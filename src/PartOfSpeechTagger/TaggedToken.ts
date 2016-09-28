import Token = require("../Token");

class TaggedToken extends Token {
    constructor(word: string, private tag: string, private attributes: string[] = []) {
        super(word);
    }

    public setTag(tag: string): void {
        this.tag = tag;
    }

    public getTag(): string {
        return this.tag;
    }

    public getAttributes() {
        return this.attributes;
    }

    public hasAttributes() {
        return this.attributes.length > 0;
    }

    public isStartTag() {
        return this.tag === "START";
    }

    public isStartEntityTag() {
        return this.tag === "START_ENTITY";
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