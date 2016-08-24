import IParser = require("./IParser");
import ProbabilityToken = require("../ProbabilityToken");
import ParsedNode = require("../ParsedNode");
import GrammarReader = require("../GrammarReader");
import ParsedNodeCollection = require("../ParsedNodeCollection");
import ParsedNodeFactory = require("../ParsedNodeFactory");

class CYKParser implements IParser {
    constructor(private grammarReader: GrammarReader) {

    }

    public parse(probabilityTokens: ProbabilityToken[], grammar: string, removeEndToken: boolean = true): ParsedNode[] {
        let grammarRules = this.grammarReader.parse(grammar);
        let tokens = probabilityTokens;

        if (removeEndToken) {
            tokens = probabilityTokens.filter((token) => {
                return !token.isEndPoint();
            });
        }

        // let the input be a string S consisting of n characters: a1 ... an.
        // let the grammar contain r nonterminal symbols R1 ... Rr.
        // This grammar contains the subset Rs which is the set of start symbols.
        // let P[n,n,r] be an array of booleans. Initialize all elements of P to false.
        // for each i = 1 to n
        //   for each unit production Rj -> ai
        //     set P[1,i,j] = true
        let P = this.initializeArray(tokens.length);
        P = this.fillFirstLine(P, tokens);

        // for each i = 2 to n -- Length of span
        //   for each j = 1 to n-i+1 -- Start of span
        //     for each k = 1 to i-1 -- Partition of span
        //       for each production RA -> RB RC
        //         if P[k,j,B] and P[i-k,j+k,C] then set P[i,j,A] = true
        for (var i = 2; i <= tokens.length; i++) { //percorre as linhas
            for (var j = 1; j <= (tokens.length - i) + 1; j++) { //percorre as colunas
                for (var k = 1; k <= i - 1; k++) {
                    var first = P[k - 1][j - 1];
                    var second = P[i - k - 1][j + k - 1];

                    if (!(first && second)) {
                        continue;
                    }

                    //múltiplico todas as combinações possiveis
                    for (let firstToken of first) {
                        for (let secondToken of second) {
                            //se existir uma combinação salvo num array
                            let parsedNodeCollection = new ParsedNodeCollection([firstToken, secondToken]);
                            let nodeTag = "";

                            if (nodeTag = grammarRules.get(parsedNodeCollection.getTags())) {
                                let parsedNode = ParsedNodeFactory.create(parsedNodeCollection, nodeTag);

                                P[i - 1][j - 1].push(parsedNode);
                            }
                        }
                    }
                }
            }
        }

        return P;
    }

    private initializeArray(length: number): any[] {
        var P = new Array(length);

        for (let i = 0; i < length; i++) {
            P[i] = [];

            for (let j = 0; j < (length - i); j++) {
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