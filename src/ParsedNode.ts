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

    public findAll(tags: string): ParsedNode[] {
        let parsedNodes: ParsedNode[] = [];
        let findAll = (parent: ParsedNode) => {
            if (parent.getFirstChildTagName() == tags) {
                parsedNodes.push(parent);
            }

            for (let child of parent.getNodes()) {
                findAll(child);
            }
        }

        findAll(this);

        return parsedNodes;
    }

    public hasTag(tag: string): boolean {
        for (let parsedNode of this.getNodes()) {
            if (parsedNode.isTag(tag)) {
                return true;
            }
        }

        return false;
    }

    public replaceTag(text: string, tag: string) {
        let func = (father: ParsedNode) => {
            if (father.getTag() == tag) {
                father.setText(text);
                father.setNodeName(tag);
                father.clearNodes();

                return;
            }

            for (let child of father.getNodes()) {
                return func(child);
            }
        }

        func(this);

        this.regenerateText();
    }

    /*
    * Get the first parsed result
    * @param {string} tag - Tag to be searched.
    * @returns {ParsedResult} Parsed result 
    */
    public find(tag: string): ParsedNode {
        if (this.tag === tag) {
            return this;
        }

        let find = (father: ParsedNode) => {
            if (father.getTag() == tag) {
                return father;
            }

            for (let child of father.getNodes()) {
                let tag = find(child);

                if (tag) {
                    return child;
                }
            }
        }

        let node = find(this);
        return node;
    }

    private regenerateText() {
        let regenerateText = (father: ParsedNode) => {
            if (father.getNodes().length > 0) {
                let text = "";

                for (let child of father.getNodes()) {
                    let childText = regenerateText(child);

                    text = text == "" ? childText : text + " " + childText;
                }

                father.setText(text);

                return text;
            }
            else {
                return father.getText();
            }
        }

        let text = regenerateText(this);

        this.setText(text);
    }

    public clone(): ParsedNode {
        function clone(parent: ParsedNode) {
            let nodes = [];

            for(let child of parent.getNodes()) {
                nodes.push(clone(child));
            }

            return new ParsedNode(parent.getText(), parent.getTag(), nodes);
        }

        return clone(this);
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