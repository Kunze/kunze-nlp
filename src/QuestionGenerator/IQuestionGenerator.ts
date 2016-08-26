import ProbabilityToken = require("../ProbabilityToken");

interface IQuestionGenerator {
    generate(parsedNodes: ProbabilityToken[]): string[];
}

export = IQuestionGenerator;