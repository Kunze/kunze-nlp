import ParsedNode = require("../ParsedNode");

interface IQuestionExtractor {
    extract(parsedNodes: ParsedNode): string[];
}

export = IQuestionExtractor;