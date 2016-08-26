import ParsedNode = require("../ParsedNode");

class Question {
    private _nodeName: string;
    private _text: string;

    constructor(private parsedNode: ParsedNode) {
        this._nodeName = parsedNode.getTag();
        this._text = parsedNode.getText();
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

        func(this.parsedNode);

        this.regenerateText();
    }

    /*
    * Get the first parsed result
    * @param {string} tag - Tag to be searched.
    * @returns {ParsedResult} Parsed result 
    */
    public find(tag: string): ParsedNode {
        if (this._nodeName === tag) {
            return this.parsedNode;
        }

        let func = (father: ParsedNode) => {
            if(father.getTag() == tag) {
                return father;
            }

            for(let child of father.getNodes()) {
                let tag = func(child);

                if(tag) {
                    return child;
                }
            }
        }

        let node = func(this.parsedNode);
        return node;
    }

    private regenerateText() {
        let func = (father: ParsedNode) => {
            if (father.getNodes().length > 0) {
                let text = "";

                for (let child of father.getNodes()) {
                    let childText = func(child);

                    text = text == "" ? childText : text + " " + childText;
                }

                father.setText(text);

                return text;
            }
            else {
                return father.getText();
            }
        }

        let text = func(this.parsedNode);

        this.parsedNode.setText(text);
    }

    public generate(): string {
        let question = this.parsedNode.getText();

        return question.charAt(0).toUpperCase() + question.slice(1) + "?";
    }
}

export = Question;