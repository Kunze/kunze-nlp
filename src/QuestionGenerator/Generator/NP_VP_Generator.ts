import IParser = require("../../Parser/IParser");
import ITransform = require("../ITransform");
import IQuestionGenerator = require("../IQuestionGenerator");
import ProbabilityToken = require("../../ProbabilityToken");
import QuestionToken = require("../QuestionToken");
import AbstractGenerator = require("./AbstractGenerator");

class NP_VP_Generator extends AbstractGenerator implements IQuestionGenerator {
    constructor(parser: IParser, transforms: ITransform[]) {
        super(parser, transforms);
    }

    /*
           S
        /    \
      NP     VP
      |     /   \
   NPROP   V     PP
    /      |     / \
 Murilo  gosta PREP V
                |    \
                de  nadar
    */
    public generate(tokens: ProbabilityToken[]): string[] {
    let grammar = `
Q -> NP VP
NP -> NPROP | ART N | NP PP
VP -> V NP | V PP | V ADJ
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N | PREP V | PREP+ART V | PREP VP`;
        let questions: string[] = [];
        for (let question of this.generateQuestions(tokens, grammar)) {
            questions.push(question.generate());
        }

        return questions;
    }
}

export = NP_VP_Generator;