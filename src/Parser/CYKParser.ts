import IParser = require("./IParser");
import ProbabilityToken = require("../ProbabilityToken");
import ParsedNode = require("../ParsedNode");
import GrammarBuilder = require("./GrammarBuilder");
import GrammarRulesProxy = require("../GrammarRulesProxy");
import ParsedNodeCollection = require("../ParsedNodeCollection");
import ParsedNodeFactory = require("../ParsedNodeFactory");

class CYKParser implements IParser {
    constructor(private grammar: string) {

    }

    public parse(probabilityTokens: ProbabilityToken[]): ParsedNode[] {
        let grammarRules = GrammarBuilder.fromText(this.grammar);
        let tokens = probabilityTokens.filter((token) => {
            return !token.isEndPoint();
        });

        let P = this.initializeArray(tokens.length);
        P = this.fillFirstLine(P, tokens, grammarRules);

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
                            let parsedNodeCollection = new ParsedNodeCollection([firstToken, secondToken]);
                            let nodeTag = "";

                            if (nodeTag = grammarRules.get(parsedNodeCollection.getTags())) {
                                let parsedNode = ParsedNodeFactory.create(parsedNodeCollection, nodeTag);

                                //se existir uma combinação salvo num array
                                P[i - 1][j - 1].push(parsedNode);
                            }
                        }
                    }
                }
            }
        }

        let trees = P[P.length - 1][0];

        if (trees.length) {
            return trees;
        }

        //<TODO> retornar as partes que conseguiu encontrar
        throw new Error("Grammar not recognized");
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

    private fillFirstLine(P: any[], tokens: ProbabilityToken[], grammarProxy: GrammarRulesProxy): any[] {
        for (var index = 0; index < tokens.length; index++) {
            var token = tokens[index];
            var terminalTag = grammarProxy.get(token.getTag());

            //gravo num array pois nos próximos passos podem haver mais de um ParsedNode
            P[0][index] = [
                new ParsedNode(token.getWord(), terminalTag ? terminalTag : token.getTag())
            ];
        }

        return P;
    }
}

export = CYKParser;