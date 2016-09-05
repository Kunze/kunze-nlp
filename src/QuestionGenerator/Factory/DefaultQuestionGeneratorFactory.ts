import ITransformer = require("../ITransformer");
import QuestionGenerator = require("../QuestionGenerator");
import CorporaCYKParserFactory = require("../../Parser/Factory/CorporaCYKParserFactory");
import SubjectTransformer = require("./SubjectTransformer");
import IQuestionGenerator = require("../IQuestionGenerator");

export var create = () : Promise<IQuestionGenerator> => {
    let generators: ITransformer[] = [
        new SubjectTransformer()
    ];

    return new Promise<IQuestionGenerator>((resolve, reject) => {
        CorporaCYKParserFactory.create().then((iparser)=> {
            resolve(new QuestionGenerator(iparser, generators));
        });
    });
}
