import ParsedNode = require("../../ParsedNode");
import ITransform = require("../ITransform");

abstract class AbstractBaseTransformer {
    protected transforms: ITransform[] = [];

 deepClone(arr) {
  var len = arr.length;
  var newArr = new Array(len);
  for (var i=0; i<len; i++) {
    if (Array.isArray(arr[i])) {
      newArr[i] = this.deepClone(arr[i]);
    }
    else {
      newArr[i] = arr[i];
    }
  }
  return newArr;
}

    public transform(parsedNode: ParsedNode): string[] {
        let questions: string[] = [];

        for (let transform of this.transforms) {
            for (let simplifiedNode of this.getSimplifications(parsedNode)) {
                let clone = simplifiedNode.clone();
                //let copy = new ParsedNode(simplifiedNode.getText(), parsedNode.getTag(), simplifiedNode.getNodes());
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