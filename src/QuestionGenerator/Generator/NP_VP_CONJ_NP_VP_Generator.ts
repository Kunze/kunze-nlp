import IParser = require("../../Parser/IParser");
import ITransform = require("../ITransform");
import IQuestionGenerator = require("../IQuestionGenerator");
import ProbabilityToken = require("../../ProbabilityToken");
import QuestionToken = require("../QuestionToken");
import AbstractGenerator = require("./AbstractGenerator");

class NP_VP_CONJ_NP_VP_Generator extends AbstractGenerator implements IQuestionGenerator {
    constructor(parser: IParser, transforms: ITransform[]) {
        super(parser, transforms);
    }
    //Murilo gosta de nadar e Murilo gosta de correr.
    //quem gosta de nadar e correr?

    //Murilo gosta de nadar e João gosta de correr.
    //quem gosta de nadar e quem gosta de correr? se for sujeito diferente
    /*
                      S
             _________|_________
            /                   \
           S                    CONJP
        /    \                 /    \
      NP     VP               KC     S
      |     /   \            /     /   \
   NPROP   V     PP         e    NP     VP
    /      |     / \            /      /   \
 Murilo  gosta PREP V        Murilo   V     PP
                |    \              gosta  /  \
                de  nadar                PREP  V
                                          |    |
                                         de   correr
    */
    public generate(tokens: ProbabilityToken[]): string[] {
        let grammar = `
Q -> S CONJP
S -> NP VP
CONJP -> KC S
NP -> NPROP
VP -> V PP
PP -> PREP V`;

        let questions: string[] = [];
        for (let question of this.generateQuestions(tokens, grammar)) {
            questions.push(question.generate());
        }

        return questions;
    }
}

export = NP_VP_CONJ_NP_VP_Generator;