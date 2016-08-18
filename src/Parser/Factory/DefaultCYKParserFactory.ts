import CYKParser = require("../CYKParser");
import GrammarReader = require("../../GrammarReader");

class DefaultCYKParser {
    public create(): CYKParser {
        return new CYKParser(new GrammarReader());
    }
}