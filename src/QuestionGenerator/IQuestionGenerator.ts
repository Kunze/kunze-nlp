import ParsedNode = require("../ParsedNode");

interface IQuestionGenerator {
    generate(parsedNodes: ParsedNode[]): string[];
}

export = IQuestionGenerator;