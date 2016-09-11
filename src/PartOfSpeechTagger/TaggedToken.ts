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
        return this.attributes !== undefined;
    }

    public toString(): string {
        if (this.isEntity()) {
            return this.word + "_" + this.tag + "#" + this.attributes;
        }

        return this.word + "_" + this.tag;
    }
}

export = TaggedToken;