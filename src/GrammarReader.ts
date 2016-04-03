import GrammarRule = require("./GrammarRule");
import GrammarRulesProxy = require("./GrammarRulesProxy");

class GrammarReader {
    public parse(grammar: string): GrammarRulesProxy {
        let lines = grammar.split(/\n/g), grammarRules: GrammarRule[] = [];

        for (let line of lines) {
            if (!(line.trim())) {
                //empty string
                continue;
            }

            let lineSplittedByArrow = line.split("->");
            let grammarRuleName = lineSplittedByArrow[0].trim();
            let rules = lineSplittedByArrow[1].trim();

            let grammarRuleTags: string[] = [];
            for (let rule of rules.split("|")) { // V | V PP |
                grammarRuleTags.push(rule.trim()); //V
            }

            grammarRules.push(new GrammarRule(grammarRuleName, grammarRuleTags));
        }

        return new GrammarRulesProxy(grammarRules);
    }
}

export = GrammarReader;