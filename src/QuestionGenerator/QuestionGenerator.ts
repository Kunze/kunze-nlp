import IQuestionGenerator = require("./IQuestionGenerator");
import CYKTable = require("../Parser/CYKTable");
import IParser = require("../Parser/IParser");
import ITransformer = require("./ITransformer");

class QuestionGenerator implements IQuestionGenerator {
    constructor(private transformers: ITransformer[]) {

    }

    public generate(cykTable: CYKTable): string[] {
        let arrayOfQuestions: string[] = [];
        let parsedNodes = cykTable.getNodes(); //pego todos os nodes encontrados

        //pode ter vários ambiguos
        for (let parsedNode of parsedNodes) {
            for (let transformer of this.transformers) {
                for (let question of transformer.transform(parsedNode)) {
                    arrayOfQuestions.push(question);
                }
            }
        }

        function unique(value, index, self) {
            return self.indexOf(value) === index;
        }

        return arrayOfQuestions.filter(unique);
    }
}

export = QuestionGenerator;
