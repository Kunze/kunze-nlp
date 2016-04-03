import IParser = require("./IParser");
import ProbabilityToken = require("../ProbabilityToken");
import GrammarReader = require("../GrammarReader");
import ParsedNode = require("../ParsedNode");
import ParsedNodeFactory = require("../ParsedNodeFactory");
import TokenReducer = require("../TokenReducer");

class ShiftReduceParser implements IParser {
    constructor(private _grammarReader: GrammarReader) {

    }

    public parse(tokens: ProbabilityToken[], grammar: string): ParsedNode[] {
        let parsedNodes: ParsedNode[] = [];
        let grammarRules = this._grammarReader.parse(grammar);

        for (let token of tokens) {
            parsedNodes.push(ParsedNodeFactory.from(token));
        }

        let temporaryNodes: ParsedNode[] = [];

        //left to right
        while (parsedNodes.length > 0) {
            var parsedNode = parsedNodes.shift();

            if (parsedNode.isBlankSpace() || parsedNode.isEnd()) {
                temporaryNodes.push(parsedNode);
                continue;
            }

            let grammarRule;
            if (grammarRule = grammarRules.get(parsedNode.getNodeName())) {
                temporaryNodes.push(new ParsedNode(null, grammarRule, [parsedNode]));
                continue;
            } else {
                temporaryNodes.push(parsedNode);
            }
        }

        //["O cachorro", " ", "Viu", " ", "o homem", " ", "no parque", "."] length = 8
        //right to left
        let startIndex = temporaryNodes.length; //começa no 8
        let hasModified = true;
        while (--startIndex >= 1) {
            //startIndex--;
            let secondNode = temporaryNodes[startIndex]; // "no parque"]
            if (secondNode.isBlankSpace() || secondNode.isEnd()) {
                continue;
            }

            let firstNode;// "o homem"
            let parsedNodes = [];
            let blankSpaceIndex = startIndex;
            while (true) {
                firstNode = temporaryNodes[--blankSpaceIndex];
                parsedNodes.unshift(firstNode); //adiciono no indice 0

                if (firstNode.isBlankSpace()) {
                    continue;
                }

                break; //achou a tag anterior sem ser um blank-space
            }

            let nodes = [...parsedNodes, secondNode];
            let tokenReducer = new TokenReducer(nodes);
            let tag = tokenReducer.toTagString();

            let rule;
            if (rule = grammarRules.get(tag)) {
                let newParsedNode = new ParsedNode(null, rule, nodes);
                temporaryNodes.splice(blankSpaceIndex, nodes.length, newParsedNode);
                startIndex = temporaryNodes.length;
            }
        }

        return temporaryNodes;
    }
}

export = ShiftReduceParser;