import ParsedNode = require("../../ParsedNode");
import Question = require("../Question");
import ITransform = require("../ITransform");
import ITransformer = require("../ITransformer");
import AbstractBaseTransformer = require("./AbstractBaseTransformer");
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
class SubjectTransformer extends AbstractBaseTransformer implements ITransformer {
    protected transforms: ITransform[] = [
        (parsedNode: ParsedNode) => {
            let np = parsedNode.find("NP");
            parsedNode.replaceTag("Quem", "NP");

            return new Question(parsedNode);
        },
        (parsedNode: ParsedNode) => {
            let np;
            if (np = parsedNode.find("NP")) {
                if (np.find("NPROP")) {
                    parsedNode.replaceTag("Qual o nome da pessoa que", "NP");

                    return new Question(parsedNode);;
                }
            }
        },
        (parsedNode: ParsedNode) => {
            return new Question(parsedNode);
        }
    ];

    protected getSimplifications(parsedNode: ParsedNode): ParsedNode[] {
        return parsedNode.findAll("NP VP");
    }
}

export = SubjectTransformer;
