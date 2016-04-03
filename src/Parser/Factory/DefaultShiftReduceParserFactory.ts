import IParser = require('../IParser');
import GrammarParser = require("../../GrammarReader");
import ShiftReduceParserFactory = require("../ShiftReduceParser");

module DefaultShiftReduceParserFactory {
    export var create = (): IParser => {
        return new ShiftReduceParserFactory(new GrammarParser());
    }
} 

export = DefaultShiftReduceParserFactory;