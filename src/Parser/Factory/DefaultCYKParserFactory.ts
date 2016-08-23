import CYKParser = require("../CYKParser");
import GrammarReader = require("../../GrammarReader");

module DefaultCYKParserFactory {
    export var create = (): CYKParser => {
        return new CYKParser(new GrammarReader());
    }
}

export = DefaultCYKParserFactory;