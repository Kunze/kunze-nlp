import ParsedNode = require("../../Parser/ParsedNode");
import Question = require("../Question");
import IExtractor = require("../IExtractor");
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
class SubjectTransformer extends AbstractBaseTransformer {
    protected extractors: IExtractor[] = [
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

                    return new Question(parsedNode);
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
