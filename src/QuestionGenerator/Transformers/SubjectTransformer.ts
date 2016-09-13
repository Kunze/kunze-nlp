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
    private whatNouns = ["OBJECT", "FRUIT"];
    private whoNouns = ["PERSON", "ANIMAL"];

    protected extractors: IExtractor[] = [
        (parsedNode: ParsedNode) => {
            let np = parsedNode.find("NP");

            if (np.getAttributes().length > 0) {
                var isWhoNoum = np.getAttributes().filter((attribute) => {
                    return this.whoNouns.indexOf(attribute) > 0;
                });

                if(!isWhoNoum.length) return;
            }
            parsedNode.replaceTag("Quem", "NP");

            return new Question(parsedNode);
        },
        (parsedNode: ParsedNode) => {
            let np = parsedNode.find("NP");
            for (let what of this.whatNouns) {
                if (np.is(what)) {
                    parsedNode.replaceTag("O que", "NP");

                    return new Question(parsedNode);
                }
            }
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
            let np;
            if (np = parsedNode.find("NP")) {
                if (np.find("NPROP")) {
                    parsedNode.replaceTag("Que pessoa", "NP");

                    return new Question(parsedNode);
                }
            }
        },
        (parsedNode: ParsedNode) => {
            let np;
            if (np = parsedNode.find("NP")) {
                if (np.is("OBJECT")) {
                    parsedNode.replaceTag("Qual objeto", "NP");

                    return new Question(parsedNode);
                }
            }
        },
        (parsedNode: ParsedNode) => {
            let np;
            if (np = parsedNode.find("NP")) {
                if (np.is("FRUIT")) {
                    parsedNode.replaceTag("Que fruta", "NP");

                    return new Question(parsedNode);
                }
            }
        },
                (parsedNode: ParsedNode) => {
            let np;
            if (np = parsedNode.find("NP")) {
                if (np.is("FRUIT")) {
                    parsedNode.replaceTag("Qual fruta", "NP");

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
