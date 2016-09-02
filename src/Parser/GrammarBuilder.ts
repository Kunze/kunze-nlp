import ParsedNode = require("../ParsedNode");
import GrammarRulesProxy = require("../GrammarRulesProxy");

class GrammarBuilder {
    public static fromParsedNodes(parsedNodes: ParsedNode[]): GrammarRulesProxy {
        let grammarRulesProxy = new GrammarRulesProxy();

        let func = (parsedNode: ParsedNode) => {
            if (parsedNode.getNodes().length > 0) {
                grammarRulesProxy.add(parsedNode.getTag(), parsedNode.getFirstChildTagName())

                for (let node of parsedNode.getNodes()) {
                    func(node);
                }
            }
        }

        for (let node of parsedNodes) {
            func(node);
        }

        return grammarRulesProxy;
    }

    public static fromText(grammar: string): GrammarRulesProxy {
        let lines = grammar.split(/\n/g),
            grammarRulesProxy = new GrammarRulesProxy();

        for (let line of lines) {
            if (!(line.trim())) {
                //empty string
                continue;
            }

            let lineSplittedByArrow = line.split("->");
            let grammarRuleName = lineSplittedByArrow[0].trim();
            let rules = lineSplittedByArrow[1].trim();

            for (let rule of rules.split("|")) { // V | V PP |
                grammarRulesProxy.add(grammarRuleName, rule.trim()); //V
            }
        }

        return grammarRulesProxy;
    }
}

export = GrammarBuilder;
