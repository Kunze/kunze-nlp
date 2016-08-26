import ParsedNode = require("../ParsedNode");

interface ITransformer {
    transform(parsedNodes: ParsedNode): string[];
}

export = ITransformer;