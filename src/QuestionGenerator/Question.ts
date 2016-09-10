import ParsedNode = require("../Parser/ParsedNode");

class Question {
    constructor(private parsedNode: ParsedNode) {
    }

    public generate(): string {
        let question = this.parsedNode.toString();

        return question.charAt(0).toUpperCase() + question.slice(1) + "?";
    }
}

export = Question;