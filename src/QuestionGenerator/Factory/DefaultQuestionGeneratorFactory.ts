import ITransformer = require("../ITransformer");
import QuestionGenerator = require("../QuestionGenerator");
import CorporaCYKParserFactory = require("../../Parser/Factory/CorporaCYKParserFactory");
import SubjectTransformer = require("../Transformers/SubjectTransformer");
import IQuestionGenerator = require("../IQuestionGenerator");

export var create = () : IQuestionGenerator => {
    let generators: ITransformer[] = [
        new SubjectTransformer()
    ];

    return new QuestionGenerator(generators)
}
