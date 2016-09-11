import ProbabilityToken = require("../../PartOfSpeechTagger/ProbabilityToken");
import ParsedNode = require("../ParsedNode");
import ParsedNodeCollection = require("../ParsedNodeCollection");

class ParsedNodeFactory {
    public static create(parsedNodesCollection: ParsedNodeCollection, tag: string): ParsedNode {
        let nodeText = parsedNodesCollection.getText();
        let attributes = parsedNodesCollection.getAttributes();
        let childNodes = parsedNodesCollection.getNodes();

        return new ParsedNode(nodeText, tag, attributes, childNodes)
    }
}

export = ParsedNodeFactory;