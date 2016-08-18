import IParser = require("./IParser");
import ProbabilityToken = require("../ProbabilityToken");
import ParsedNode = require("../ParsedNode");
import GrammarReader = require("../GrammarReader");

class CYKParser implements IParser {
    constructor(private grammarReader: GrammarReader) {

    }

    public parse(tokens: ProbabilityToken[], grammar: string): ParsedNode[] {
        var grammarRules = this.grammarReader.parse(grammar);

        return null;
    }
}

export = CYKParser;