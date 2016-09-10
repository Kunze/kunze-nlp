import ParsedNode = require("../../Parser/ParsedNode");

interface IQuestionExtractor {
    extract(parsedNodes: ParsedNode): string[];
}

export = IQuestionExtractor;