import ProbabilityToken = require("../ProbabilityToken");
import CYKTable = require("./CYKTable");

interface IParser {
    parse(tokens: ProbabilityToken[], grammar?: string): CYKTable
}

export = IParser;