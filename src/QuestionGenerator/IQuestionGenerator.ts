import ProbabilityToken = require("../ProbabilityToken");

interface IQuestionGenerator {
    generate(tokens: ProbabilityToken[]): string[];
}

export = IQuestionGenerator;