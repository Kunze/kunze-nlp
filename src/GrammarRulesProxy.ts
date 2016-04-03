import GrammarRule = require("./GrammarRule");
import ProbabilityToken = require("./ProbabilityToken");

class GrammarRulesProxy {
    constructor(private _grammarRules: GrammarRule[]) {
        // if(!(_grammarRules.find((value) => {
        //     return value.name === "S"
        // }))){
        //     throw new Error("no \"S\" rule found");
        // }
    }

    public grammar(index: number): GrammarRule {
        return this._grammarRules[index];
    }

    public get(rules: string): string {
        for (let grammarRule of this._grammarRules) {
            for (let match of grammarRule.matches) {
                if (rules === match) {
                    return grammarRule.name;
                }
            }
        }
    }
}

export = GrammarRulesProxy;