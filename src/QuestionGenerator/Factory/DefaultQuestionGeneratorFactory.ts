import IQuestionGenerator = require("../IQuestionGenerator");
import QuestionGenerator = require("../QuestionGenerator");
import NP_VP_CONJ_NP_VP_GeneratorFactory = require("./NP_VP_CONJ_NP_VP_GeneratorFactory");
import NP_VP_GeneratorFactory = require("./NP_VP_GeneratorFactory");

module DefaultQuestionGeneratorFactory {
    export var create = () => {
        let generators: IQuestionGenerator[] = [
            NP_VP_CONJ_NP_VP_GeneratorFactory.create(),
            NP_VP_GeneratorFactory.create()
        ];
        
        return new QuestionGenerator(generators);
    }
} 

export = DefaultQuestionGeneratorFactory;