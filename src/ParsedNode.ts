import ProbabilityToken = require("./ProbabilityToken");
import IString = require("./IString");

class ParsedNode implements IString {
    constructor(private text: string, private nodeName: string, private parsedNodes?: ParsedNode[]) {
        if (!(parsedNodes)) {
            this.parsedNodes = [];
        }
    }

    public getNodeName(): string {
        return this.nodeName;
    }

    public isTag(tag: string) {
        return this.nodeName === tag;
    }
    
    public isEnd() {
        return this.nodeName === "END"
    }

    public isBlankSpace() {
        return this.nodeName === "BLANK-SPACE"
    }

    public nodes() {
        return this.parsedNodes;
    }

    public node(index: number): ParsedNode {
        return this.parsedNodes[index];
    }

    public getText() {
        return this.text;
    }

    public toString(): string {
        if (this.text) {
            return this.text;
        }

        return this.text ? this.text : this.parsedNodes.map((value) => {
            return value.toString();
        }).join("");
    }
}

export = ParsedNode;