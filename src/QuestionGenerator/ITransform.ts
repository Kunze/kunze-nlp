import ParsedNode = require("../ParsedNode");
import Question = require("./Question");

interface ITransform {
    (parsedNodes: ParsedNode): Question;
}

export = ITransform;