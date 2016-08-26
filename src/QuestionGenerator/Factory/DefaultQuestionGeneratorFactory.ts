import ITransformer = require("../ITransformer");
import QuestionGenerator = require("../QuestionGenerator");
import DefaultCYKParserFactory = require("../../Parser/Factory/DefaultCYKParserFactory");
import SubjectTransformer = require("./SubjectTransformer");

module DefaultQuestionGeneratorFactory {
    export var create = () => {
        let generators: ITransformer[] = [
            new SubjectTransformer()
        ];
        
        let parser = DefaultCYKParserFactory.create();

        return new QuestionGenerator(parser, generators);
    }
} 

export = DefaultQuestionGeneratorFactory;
