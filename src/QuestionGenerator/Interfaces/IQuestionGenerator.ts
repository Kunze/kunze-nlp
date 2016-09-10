import CYKTable = require("../../Parser/CYKTable");

interface IQuestionGenerator {
    generate(parsedNodes: CYKTable): string[];
}

export = IQuestionGenerator;