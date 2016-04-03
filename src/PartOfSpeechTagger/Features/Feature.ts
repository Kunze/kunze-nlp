import ProbabilityToken = require("../../ProbabilityToken");
import IFeature = require("./IFeature");

class Feature implements IFeature {
    /*
              O    leão   caça    a    lebre.
      wrong: ART    N      N     ART    N
      ok   : ART    N      V     ART    N
    */
    public apply(probabilityTokens: ProbabilityToken[],
        arrayOfProbabilityTokens: ProbabilityToken[][],
        results: ProbabilityToken[][]) {
        for (var index = 0; index < probabilityTokens.length; index++) {
            var probabilityToken = probabilityTokens[index];
            var isN = probabilityToken.getTag() === "N";

            if (isN) {
                var nextPossibleTokens = this.getNextProbabilityToken(arrayOfProbabilityTokens, index + 1);

                var n = nextPossibleTokens.find(token => {
                    return token.getTag() === "N";
                })
                var v = nextPossibleTokens.find(token => {
                    return token.getTag() === "V";
                });

                if (n && v) {
                    var index = results.indexOf(probabilityTokens);
                    results.splice(index, 1)

                    console.log("----- Feature aplicada");

                    return true;
                }
            }
        }

        return false;
    }

    private getNextProbabilityToken(arrayOfProbabilityTokens: ProbabilityToken[][], currentIndex: number): ProbabilityToken[] {
        for (currentIndex; currentIndex <= arrayOfProbabilityTokens.length; currentIndex++) {
            let probabilityTokens = arrayOfProbabilityTokens[currentIndex];

            if (probabilityTokens.find(token => {
                return token.getTag() === "BLANK-SPACE"
            })) {
                continue;
            }

            return probabilityTokens;
        }
    }
}

export = Feature;