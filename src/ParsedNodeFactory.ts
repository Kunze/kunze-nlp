import ProbabilityToken = require("./ProbabilityToken");
import ParsedNode = require("./ParsedNode");
import ParsedNodeCollection = require("./ParsedNodeCollection");

class ParsedNodeFactory {
    public static create(parsedNodesCollection: ParsedNodeCollection, tag: string): ParsedNode {
        let nodeText = parsedNodesCollection.getText();

        return new ParsedNode(nodeText, tag, parsedNodesCollection.getNodes())
    }
}

export = ParsedNodeFactory;