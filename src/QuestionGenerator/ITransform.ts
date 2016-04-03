import ParsedNode = require("../ParsedNode");
import QuestionToken = require("./QuestionToken");

interface ITransform {
    (parsedNodes: ParsedNode): QuestionToken;
}

export = ITransform;