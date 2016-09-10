import CYKParser = require("../CYKParser");
import GrammarBuilder = require("../../Parser/Grammar/GrammarBuilder");

module DefaultCYKParserFactory {
    export var create = (): CYKParser => {
        let grammar = `
S -> NP VP
CONJP -> KC S
NP -> N | NPROP | ART N | ART NPROP | ART NP | NP PP
VP -> V NP | V PP | V ADJ
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N | PREP V | PREP+ART V | PREP VP`;

        return new CYKParser(grammar.trim());
    }
}

export = DefaultCYKParserFactory;
