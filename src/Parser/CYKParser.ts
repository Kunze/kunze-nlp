import IParser = require("./IParser");
import ProbabilityToken = require("../ProbabilityToken");
import ParsedNode = require("../ParsedNode");
import GrammarReader = require("../GrammarReader");

class CYKParser implements IParser {
    constructor(private grammarReader: GrammarReader) {

    }

    public parse(tokens: ProbabilityToken[], grammar: string): ParsedNode[] {
        var grammarRules = this.grammarReader.parse(grammar);

        // let the input be a string S consisting of n characters: a1 ... an.
        // let the grammar contain r nonterminal symbols R1 ... Rr.
        // This grammar contains the subset Rs which is the set of start symbols.
        // let P[n,n,r] be an array of booleans. Initialize all elements of P to false.
        // for each i = 1 to n
        //   for each unit production Rj -> ai
        //     set P[1,i,j] = true
        let P = this.initializeArray(tokens.length);
        P = this.fillFirstLine(P, tokens);
debugger;
        return null;
    }

    private initializeArray(length: number): any[] {
        var P = new Array(length);

        for (let i = 0; i <= length; i++) {
            P[i] = [];

            for (let j = 0;  j <= (length - i); j++) {
                P[i].push([]);
            }
        }

        return P;
    }

    private fillFirstLine(P: any[], tokens: ProbabilityToken[]): any[] {
        for (var index = 0; index < tokens.length; index++) {
            var token = tokens[index];
            
            //gravo num array pois nos próximos passos podem haver mais de um ParsedNode
            P[0][index] = [
                new ParsedNode(token.getWord(), token.getTag())
            ];
        }

        return P;
    }
}

export = CYKParser;