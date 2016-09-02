import ProbabilityToken = require("./ProbabilityToken");
import IString = require("./IString");

class ParsedNode implements IString {
    constructor(private text: string, private tag: string, private parsedNodes?: ParsedNode[]) {
        if (!(parsedNodes)) {
            this.parsedNodes = [];
        }
    }

    public getTag(): string {
        return this.tag;
    }

    public setNodeName(nodeName: string) {
        this.tag = nodeName;
    }

    public isTag(tag: string) {
        return this.tag === tag;
    }

    public isEnd() {
        return this.tag === "END"
    }

    public isBlankSpace() {
        return this.tag === "BLANK-SPACE"
    }

    public getNodes(): ParsedNode[] {
        return this.parsedNodes;
    }

    public node(index: number): ParsedNode {
        return this.parsedNodes[index];
    }

    public getText() {
        return this.text;
    }

    public setText(text: string) {
        this.text = text;
    }

    public clearNodes() {
        this.parsedNodes = [];
    }

    /**
    * Get first child parsedNode tags
    */
    public getFirstChildTagName() {
        let tags = "";

        for (let node of this.parsedNodes) {
            if (!tags) {
                tags = node.getTag();
            } else {
                tags = `${tags} ${node.getTag()}`;
            }
        }

        return tags;
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