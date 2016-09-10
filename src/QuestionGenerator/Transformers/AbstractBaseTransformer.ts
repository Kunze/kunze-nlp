import ParsedNode = require("../../ParsedNode");
import IExtractor = require("../IExtractor");
import IQuestionExtractor = require("../IQuestionExtractor");

abstract class AbstractBaseTransformer implements IQuestionExtractor {
    protected extractors: IExtractor[] = [];

    deepClone(arr) {
        var len = arr.length;
        var newArr = new Array(len);
        for (var i = 0; i < len; i++) {
            if (Array.isArray(arr[i])) {
                newArr[i] = this.deepClone(arr[i]);
            }
            else {
                newArr[i] = arr[i];
            }
        }
        return newArr;
    }

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