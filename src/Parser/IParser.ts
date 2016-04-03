import ProbabilityToken = require("../ProbabilityToken");
import ParsedNode = require("../ParsedNode");

interface IParser {
    parse(tokens: ProbabilityToken[], grammar: string): ParsedNode[]
}

export = IParser;