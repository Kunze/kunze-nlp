import IQuestionExtractor = require("../IQuestionExtractor");
import QuestionGenerator = require("../QuestionGenerator");
import CorporaCYKParserFactory = require("../../Parser/Factory/CorporaCYKParserFactory");
import SubjectTransformer = require("../Transformers/SubjectTransformer");
import IQuestionGenerator = require("../IQuestionGenerator");

export var create = () : IQuestionGenerator => {
    let extractors: IQuestionExtractor[] = [
        new SubjectTransformer()
    ];

    return new QuestionGenerator(extractors)
}
