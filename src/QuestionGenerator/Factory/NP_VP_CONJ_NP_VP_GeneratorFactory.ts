import IQuestionGenerator = require("../IQuestionGenerator");
import NP_VP_CONJ_NPVP_Generator = require("../Generator/NP_VP_CONJ_NP_VP_Generator");
// import DefaultShiftReduceParserFactory = require("../../Parser/Factory/DefaultShiftReduceParserFactory");
import ParsedNode = require("../../ParsedNode");
import QuestionToken = require("../QuestionToken");

module NP_VP_CONJ_NP_VP_GeneratorFactory {
    export var create = (): IQuestionGenerator => {
        // let parser = DefaultShiftReduceParserFactory.create();
        let parser = null;
        let transformers = [
            (parsedNode: ParsedNode) => {
                let question = new QuestionToken(parsedNode);

                return question;
            },
            (parsedNode: ParsedNode) => {
                let question = new QuestionToken(parsedNode);
                var results: QuestionToken[] = question.findAll("NPROP");

                let firstNPROP = results[0].text;
                let secondNPROP = results[1].text;

                if (firstNPROP === secondNPROP) {
                    results[0].replaceText("Quem");
                    results[1].erase();
                }
                else {
                    results[0].replaceText("Quem");
                    results[1].replaceText("quem");
                }
                //<TODO> Murilo gosta de nadar e Murilo gosta de correr.
                //quem gosta de nadar e correr?
                return question;
            },
        ];

        return new NP_VP_CONJ_NPVP_Generator(parser, transformers);
    }
}

export = NP_VP_CONJ_NP_VP_GeneratorFactory;