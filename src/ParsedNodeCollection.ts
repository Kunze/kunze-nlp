import ProbabilityToken = require("./ProbabilityToken");
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
            return parsedResult.getNodeName();
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

    public getNodes(): ParsedNode[] {
        return this.parsedNodes;
    }
}

export = ParsedNodeCollection;