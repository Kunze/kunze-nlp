import IGrammarProvider = require("./IGrammarProvider");

class TextGrammarProvider implements IGrammarProvider {
    constructor(private grammar: string) {

    }

    public provide(): string {
        return this.grammar;
    }
}

export = TextGrammarProvider;