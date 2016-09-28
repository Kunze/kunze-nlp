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
    private whatNouns = ["OBJECT", "FRUIT", "STATE", "CITY"];
    private whoNouns = ["PERSON", "ANIMAL"];

    private transformTo(parsedNode: ParsedNode, attribute: string, replaceText: string) {
        let np = parsedNode.find("NP");

        if (np.is(attribute)) {
            parsedNode.replaceTag(replaceText, "NP");

            return new Question(parsedNode);
        }
    }

    protected extractors: IExtractor[] = [
        (parsedNode: ParsedNode) => {
            let np = parsedNode.find("NP");

            if (np.getAttributes().length > 0) {
                var isWhoNoum = np.getAttributes().filter((attribute) => {
                    return this.whoNouns.indexOf(attribute) > -1;
                });

                if (!isWhoNoum.length) return;
            }
            parsedNode.replaceTag("Quem", "NP");

            return new Question(parsedNode);
        },
        (parsedNode: ParsedNode) => {
            let np = parsedNode.find("NP");

            if (np.getAttributes().length > 0) {
                var isWhatNoum = np.getAttributes().filter((attribute) => {
                    return this.whatNouns.indexOf(attribute) > -1;
                });

                if (!isWhatNoum.length) return;
            }

            parsedNode.replaceTag("O que", "NP");

            return new Question(parsedNode);
        },
        (parsedNode: ParsedNode) => {
            return this.transformTo(parsedNode, "PERSON", "Qual o nome da pessoa que");
        },
        (parsedNode: ParsedNode) => {
            return this.transformTo(parsedNode, "PERSON", "Que pessoa");
        },
        (parsedNode: ParsedNode) => {
            return this.transformTo(parsedNode, "OBJECT", "Qual objeto");
        },
        (parsedNode: ParsedNode) => {
            return this.transformTo(parsedNode, "FRUIT", "Qual fruta");
        },
        (parsedNode: ParsedNode) => {
            return this.transformTo(parsedNode, "STATE", "Qual estado");
        },
        (parsedNode: ParsedNode) => {
            return this.transformTo(parsedNode, "CITY", "Qual cidade");
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
