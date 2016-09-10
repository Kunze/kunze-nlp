import ProbabilityToken = require("../../PartOfSpeechTagger/ProbabilityToken");
import CYKTable = require("../CYKTable");

interface IParser {
    parse(tokens: ProbabilityToken[], grammar?: string): CYKTable
}

export = IParser;