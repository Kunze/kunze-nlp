import IQuestionExtractor = require("../Interfaces/IQuestionExtractor");
import QuestionGenerator = require("../QuestionGenerator");
import SubjectTransformer = require("../Transformers/SubjectTransformer");
import IQuestionGenerator = require("../Interfaces/IQuestionGenerator");

export var create = () : IQuestionGenerator => {
    let extractors: IQuestionExtractor[] = [
        new SubjectTransformer()
    ];

    return new QuestionGenerator(extractors)
}
