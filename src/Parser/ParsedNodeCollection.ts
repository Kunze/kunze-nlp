import ProbabilityToken = require("../PartOfSpeechTagger/ProbabilityToken");
import ParsedNode = require("./ParsedNode");

class ParsedNodeCollection {
    constructor(private parsedNodes: ParsedNode[]) {

    }
    //<TODO> parametro opcioanl para ignorar BLANK-SPACE
    //recebe: [{name: "NPROP", word: "Murilo"}, 
    //        {name: "BLANK-SPACE", word: " "}, 
    //        {name: "V", word: "gosta"}]]
    //e retorna: "NPROP V"
    public getTags(): string {
        return this.parsedNodes.filter((parsedResult, index, array) => {
            return !(parsedResult.isBlankSpace());
        }).map((parsedResult, index, array) => {
            return parsedResult.getTag();
        }).join(" ");
    }

    //<TODO> parametro opcioanl para ignorar BLANK-SPACE
    //recebe: [{name: "NPROP", word: "Murilo"}, 
    //        {name: "BLANK-SPACE", word: " "}, 
    //        {name: "V", word: "gosta"}]]
    //e retorna: "Murilo gosta"
    public getText(): string {
        return this.parsedNodes.filter((parsedResult, index, array) => {
            return !(parsedResult.isBlankSpace());
        }).map((parsedResult, index, array) => {
            return parsedResult.getText();
        }).join(" ");
    }

    public getAttributes() {
        return this.parsedNodes.reduce((initial: string[], parsedNode: ParsedNode) => {
            for (let attribute of parsedNode.getAttributes()) {
                initial.push(attribute);
            }

            return initial;
        }, []);
    }

    public getNodes(): ParsedNode[] {
        return this.parsedNodes;
    }
}

export = ParsedNodeCollection;