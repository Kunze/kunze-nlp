import ParsedNode = require("../../Parser/ParsedNode");
import IExtractor = require("../IExtractor");
import IQuestionExtractor = require("../Interfaces/IQuestionExtractor");

abstract class AbstractBaseTransformer implements IQuestionExtractor {
    protected extractors: IExtractor[] = [];

    public extract(parsedNode: ParsedNode): string[] {
        let questions: string[] = [];

        for (let transform of this.extractors) {
            for (let simplifiedNode of this.getSimplifications(parsedNode)) {
                let clone = simplifiedNode.clone();
                let questionToken = transform(clone);

                if (questionToken) {
                    questions.push(questionToken.generate());
                }
            }
        }

        return questions;
    }

    protected abstract getSimplifications(parsedNode: ParsedNode): ParsedNode[];
}

export = AbstractBaseTransformer;