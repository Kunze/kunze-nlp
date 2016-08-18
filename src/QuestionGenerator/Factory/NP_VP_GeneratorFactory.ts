import IQuestionGenerator = require("../IQuestionGenerator");
import NP_VP_Generator = require("../Generator/NP_VP_Generator");
// import DefaultShiftReduceParserFactory = require("../../Parser/Factory/DefaultShiftReduceParserFactory");
import ParsedNode = require("../../ParsedNode");
import QuestionToken = require("../QuestionToken");
import ITransform = require("../ITransform");

module NP_VP_GeneratorFactory {
    export var create = (): IQuestionGenerator => {
        // let parser = DefaultShiftReduceParserFactory.create();
        let parser = null;
        let transforms: ITransform[] = [
            (parsedNode: ParsedNode) => {
                let question = new QuestionToken(parsedNode);
                question.replaceTag("Quem", "NP");

                return question;
            },
            (parsedNode: ParsedNode) => {
                let question = new QuestionToken(parsedNode);
                let np;
                if (np = question.find("NP")) {
                    if (np.find("NPROP")) {
                        question.replaceTag("Qual o nome da pessoa que", "NP");
                        
                        return question;
                    }
                }
            },
            (parsedNode: ParsedNode) => {
                return new QuestionToken(parsedNode);
            }
        ];

        return new NP_VP_Generator(parser, transforms);
    }
}

export = NP_VP_GeneratorFactory;