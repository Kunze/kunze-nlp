import ProbabilityToken = require("./ProbabilityToken");

class BlankSpaceProbabilityToken extends ProbabilityToken {
    constructor() {
        super(" ", "BLANK-SPACE", [], 1, true);
    }
}

export = BlankSpaceProbabilityToken;