// import IString = require("./IString");
// import ParsedNode = require("./ParsedNode");

// class TokenReducer {
//     constructor(private _parsedNodes: ParsedNode[]) {

//     }

//     //<TODO> parametro opcioanl para ignorar BLANK-SPACE
//     //recebe: [{name: "NPROP", word: "Murilo"}, 
//     //        {name: "BLANK-SPACE", word: " "}, 
//     //        {name: "V", word: "gosta"}]]
//     //e retorna: "NPROP V"
//     public toTagString(): string {
//         return this._parsedNodes.filter((parsedResult, index, array) => {
//             return !(parsedResult.isBlankSpace());
//         }).map((parsedResult, index, array) => {
//             return parsedResult.getNodeName();
//         }).join(" ");
//     }
// }

// export = TokenReducer;