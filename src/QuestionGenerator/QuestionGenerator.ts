import IQuestionGenerator = require("./IQuestionGenerator");
import ParsedNode = require("../ParsedNode");
import IParser = require("../Parser/IParser");
import ITransformer = require("./ITransformer");

class QuestionGenerator implements IQuestionGenerator {
    constructor(private transformers: ITransformer[]) {

    }

    public generate(parsedNodes: ParsedNode[]): string[] {
        let arrayOfQuestions: string[] = [];

        //pode ter vários ambiguos
        for (let parsedNode of parsedNodes) {
            for (let transformer of this.transformers) {
                for (let question of transformer.transform(parsedNode)) {
                    arrayOfQuestions.push(question);
                }
            }
        }

        return arrayOfQuestions;
    }
}

export = QuestionGenerator;
