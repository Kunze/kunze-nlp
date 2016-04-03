import IQuestionGenerator = require("./IQuestionGenerator");
import ProbabilityToken = require("../ProbabilityToken");

class QuestionGenerator implements IQuestionGenerator {
    constructor(private _generators: IQuestionGenerator[]) {

    }

    public generate(tokens: ProbabilityToken[]): string[] {
        let arrayOfQuestions: string[] = [];

        for (let generator of this._generators) {
            let questions = generator.generate(tokens);
            
            arrayOfQuestions.push(...questions);
        }
        
        return arrayOfQuestions;
    }
}

export = QuestionGenerator;