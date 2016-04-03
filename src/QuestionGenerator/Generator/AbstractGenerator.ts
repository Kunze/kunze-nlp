import IParser = require("../../Parser/IParser");
import ITransform = require("../ITransform");
import IQuestionGenerator = require("../IQuestionGenerator");
import ProbabilityToken = require("../../ProbabilityToken");
import QuestionToken = require("../QuestionToken");

abstract class AbstractGenerator {
    constructor(private _parser: IParser, private _transforms: ITransform[]) {
    }

    public generateQuestions(tokenResults: ProbabilityToken[], grammar: string): QuestionToken[] {
        let questions: QuestionToken[] = [];
        let parsedNodes = this._parser.parse(tokenResults, grammar).filter(parsedToken => {
            return parsedToken.isTag("Q");
        });

        for (let parsedNode of parsedNodes) {
            for (let transform of this._transforms) {
                let question = transform(parsedNode);
                if (question) {
                    questions.push(question);
                }
            }
        }

        return questions;
    }
}

export = AbstractGenerator;