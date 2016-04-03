import ProbabilityToken = require("../../ProbabilityToken");

interface IFeature {
    apply(probabilityTokens: ProbabilityToken[], 
    arrayOfProbabilityTokens: ProbabilityToken[][], 
    results: ProbabilityToken[][])
}

export = IFeature;