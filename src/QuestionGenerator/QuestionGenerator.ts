import IQuestionGenerator = require("./Interfaces/IQuestionGenerator");
import CYKTable = require("../Parser/CYKTable");
import IQuestionExtractor = require("./Interfaces/IQuestionExtractor");

class QuestionGenerator implements IQuestionGenerator {
    constructor(private extractors: IQuestionExtractor[]) {

    }

    public generate(cykTable: CYKTable): string[] {
        let arrayOfQuestions: string[] = [];
        let parsedNodes = cykTable.getNodes(); //pego todos os nodes encontrados

        //pode ter vários ambiguos
        for (let parsedNode of parsedNodes) {
            for (let extractor of this.extractors) {
                for (let question of extractor.extract(parsedNode)) {
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
