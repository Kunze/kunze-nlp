import ProbabilityToken = require("../PartOfSpeechTagger/ProbabilityToken");
import ParsedNode = require("./ParsedNode");

class ParsedNodeCollection {
    constructor(private firstNode: ParsedNode, private secondNode: ParsedNode) {

    }
    //<TODO> parametro opcioanl para ignorar BLANK-SPACE
    //recebe: [{name: "NPROP", word: "Murilo"}, 
    //        {name: "BLANK-SPACE", word: " "}, 
    //        {name: "V", word: "gosta"}]]
    //e retorna: "NPROP V"
    public getTags(): string {
        return `${this.firstNode.getTag()} ${this.secondNode.getTag()}`;
    }

    //<TODO> parametro opcioanl para ignorar BLANK-SPACE
    //recebe: [{name: "NPROP", word: "Murilo"}, 
    //        {name: "BLANK-SPACE", word: " "}, 
    //        {name: "V", word: "gosta"}]]
    //e retorna: "Murilo gosta"
    public getText(): string {
        return `${this.firstNode.getText()} ${this.secondNode.getText()}`;
    }

    public getAttributes() : string[] {
        var attributes = [];

        attributes = [].concat.apply(attributes, this.firstNode.getAttributes());
        attributes = [].concat.apply(attributes, this.secondNode.getAttributes());

        return attributes;
    }

    public getNodes(): ParsedNode[] {
        return [this.firstNode, this.secondNode];
    }
}

export = ParsedNodeCollection;