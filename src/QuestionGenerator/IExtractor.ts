import ParsedNode = require("../ParsedNode");
import Question = require("./Question");

interface IExtractor {
    (parsedNodes: ParsedNode): Question;
}

export = IExtractor;