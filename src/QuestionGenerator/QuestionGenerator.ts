import IQuestionGenerator = require("./IQuestionGenerator");
import ProbabilityToken = require("../ProbabilityToken");
import IParser = require("../Parser/IParser");
import ITransformer = require("./ITransformer");

class QuestionGenerator implements IQuestionGenerator {
    constructor(private parser: IParser, private transformers: ITransformer[]) {

    }

    public generate(tokens: ProbabilityToken[]): string[] {
        //<TODO> criar um grammar provider
        let grammar = `
S -> NP VP
CONJP -> KC S
NP -> NPROP | ART N | NP PP
VP -> V NP | V PP | V ADJ
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N | PREP V | PREP+ART V | PREP VP`

        //pode ter vários ambiguos
        let parsedNodes = this.parser.parse(tokens, grammar);
        let arrayOfQuestions: string[] = [];

        for (let transformer of this.transformers) {
            for (let parsedNode of parsedNodes) {
                for(let question of transformer.transform(parsedNode)) {
                    arrayOfQuestions.push(question);                    
                }
            }
        }

        return arrayOfQuestions;
    }
}

export = QuestionGenerator;
