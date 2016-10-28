import IQuestionExtractor = require("../Interfaces/IQuestionExtractor");
import QuestionGenerator = require("../QuestionGenerator");
import SubjectTransformer = require("../Transformers/SubjectTransformer");
import WhereTransformer = require("../Transformers/WhereTransformer");
import IQuestionGenerator = require("../Interfaces/IQuestionGenerator");

export var create = () : IQuestionGenerator => {
    let extractors: IQuestionExtractor[] = [
        new SubjectTransformer(),
        new WhereTransformer()
    ];

    return new QuestionGenerator(extractors)
}
