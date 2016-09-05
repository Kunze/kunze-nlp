import ParsedNode = require("../ParsedNode");
import Grammar = require("../Grammar");

class GrammarBuilder {
    public static fromParsedNodes(parsedNodes: ParsedNode[]): Grammar {
        let grammar = new Grammar();

        let func = (parsedNode: ParsedNode) => {
            if (parsedNode.getNodes().length > 0) {
                grammar.add(parsedNode.getTag(), parsedNode.getFirstChildTagName())

                for (let node of parsedNode.getNodes()) {
                    func(node);
                }
            }
        }

        for (let node of parsedNodes) {
            func(node);
        }

        return grammar;
    }

    public static fromText(grammarText: string): Grammar {
        let lines = grammarText.split(/\n/g),
            grammar = new Grammar();

        for (let line of lines) {
            if (!(line.trim())) {
                //empty string
                continue;
            }

            let lineSplittedByArrow = line.split("->");
            let grammarRuleName = lineSplittedByArrow[0].trim();
            let rules = lineSplittedByArrow[1].trim();

            for (let rule of rules.split("|")) { // V | V PP |
                grammar.add(grammarRuleName, rule.trim()); //V
            }
        }

        return grammar;
    }
}

export = GrammarBuilder;
