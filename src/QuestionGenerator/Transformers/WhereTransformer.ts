import ParsedNodeCollection = require("../../Parser/ParsedNodeCollection");
import ParsedNode = require("../../Parser/ParsedNode");
import Question = require("../Question");
import IExtractor = require("../IExtractor");
import AbstractBaseTransformer = require("./AbstractBaseTransformer");
import ParsedNodeFactory = require("../../Parser/Factory/ParsedNodeFactory");
import Utils = require("../../Utils/Utils");
/**
 * Murilo viajou para a Espanha.
 */
class WhereTransformer extends AbstractBaseTransformer {
    protected extractors: IExtractor[] = [
        (parsedNode: ParsedNode) => {
            let nodes = parsedNode.getNodes();
            let np = nodes[0]; //Murilo
            let vp = nodes[1]; //viajou para a Espanha.
            let v = vp.findAll("V")[0];
            let pps = vp.findAll("PP");
            let pp = pps[0]; //PP - para a Espanha
            let onde = new ParsedNode("onde", "ADV-KS", []);
            let ppOndeCollection = new ParsedNodeCollection(pp.getNodes()[0], onde);
            let ppOnde = ParsedNodeFactory.create(ppOndeCollection, "");

            let parsedNodeCollection = new ParsedNodeCollection(vp, np);

            return Utils.capitalizeFirstLetter(`${ppOnde.getText()} ${np.getText()} ${v.getText()}?`);
        }
    ];

    protected getSimplifications(parsedNode: ParsedNode): ParsedNode[] {
        var sentences: ParsedNode[] = parsedNode.findAll("NP VP");
        let simplifications = [];

        for (let sentence of sentences) {
            let pp = sentence.findAll("PP");

            if (pp.length) {
                if (pp[0].hasttribute("LOCAL")) {
                    simplifications.push(sentence);
                }
            }
        }

        return simplifications;
    }
}

export = WhereTransformer;
