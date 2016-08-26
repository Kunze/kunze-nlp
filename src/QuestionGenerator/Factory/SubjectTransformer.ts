import IQuestionGenerator = require("../IQuestionGenerator");
import DefaultCYKParserFactory = require("../../Parser/Factory/DefaultCYKParserFactory");
import ParsedNode = require("../../ParsedNode");

//Question é temporaria
import Question = require("../Question");

import ITransform = require("../ITransform");
import ITransformer = require("../ITransformer");

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

class SubjectTransformer implements ITransformer {
    private transforms: ITransform[] = [
        (parsedNode: ParsedNode) => {
            let question = new Question(parsedNode);
            question.replaceTag("Quem", "NP");

            return question.generate();
        },
        // (parsedNode: ParsedNode) => {
        //     let question = new Question(parsedNode);
        //     let np;
        //     if (np = question.find("NP")) {
        //         if (np.find("NPROP")) {
        //             question.replaceTag("Qual o nome da pessoa que", "NP");

        //             return question.generate();
        //         }
        //     }
        // },
        (parsedNode: ParsedNode) => {
            return new Question(parsedNode).generate();
        }
    ];

    public transform(parsedNode: ParsedNode): string[] {
        let questions: string[] = [];

        for (let transform of this.transforms) {
            var copy = new ParsedNode(parsedNode.getText(), parsedNode.getTag(), parsedNode.getNodes().slice());

            let questionToken = transform(copy);

            if (questionToken) {
                questions.push(questionToken);
            }
        }

        return questions;
    }
}

export = SubjectTransformer;
