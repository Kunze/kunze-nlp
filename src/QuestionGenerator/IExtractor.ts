import ParsedNode = require("../Parser/ParsedNode");
import Question = require("./Question");

interface IExtractor {
    (parsedNodes: ParsedNode): string;
}

export = IExtractor;