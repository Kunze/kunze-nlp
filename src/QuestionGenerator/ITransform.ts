import ParsedNode = require("../ParsedNode");

interface ITransform {
    (parsedNodes: ParsedNode): string;
}

export = ITransform;