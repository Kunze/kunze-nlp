import ParsedNode = require("../ParsedNode");

//<TODO> Pensar em um nome melhor
class QuestionToken {
    private _nodeName: string;
    private _text: string;
    private _tokenQuestions: QuestionToken[] = [];

    constructor(parsedNode: ParsedNode) {
        this._nodeName = parsedNode.getNodeName();
        this._text = parsedNode.getText();

        for (let result of parsedNode.nodes()) {
            this._tokenQuestions.push(new QuestionToken(result));
        }
    }

    public findAll(tag: string): QuestionToken[] {
        let results: QuestionToken[] = [];

        if (this._nodeName === tag) {
            results.push(this);
        }

        for (let questionToken of this._tokenQuestions) {
            var result = questionToken.find(tag);

            if (result) {
                results.push(result);
            }
        }

        return results;
    }

    /*
    * Get the first parsed result
    * @param {string} tag - Tag to be searched.
    * @returns {ParsedResult} Parsed result 
    */
    public find(tag: string): QuestionToken {
        if (this._nodeName === tag) {
            return this;
        }

        for (let questionToken of this._tokenQuestions) {
            var result = questionToken.find(tag);

            if (result) {
                return result;
            }
        }
    }

    public tokens() {
        return this._tokenQuestions;
    }

    public get nodeName() {
        return this._nodeName;
    }

    public get text() {
        return this._text;
    }

    public erase() {
        this._text = "";
        this._nodeName = null;
        this._tokenQuestions = [];
    }
    
    public replaceText(text: string) {
        this._text = text;
    }

    /*
    * Replace the first tag matched
    * @param {string} tag - Tag
    * @param {string} text - Text to be replaced
    */
    public replaceTag(text: string, tag: string) {
        for (let questionToken of this._tokenQuestions) {
            var result = questionToken.find(tag);

            if (result) {
                questionToken.replaceText(text);
                break;
            }
        }
    }

    public generate() {
        let phrase = this.toString() + "?";
        
        return phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }

    public toString() {
        if (this._text) {
            return this._text;
        }

        return this._tokenQuestions.map((value) => {
            return value.toString();
        }).join("").replace(/\s+/g, " "); //<TODO> fazer replace de dois blanks-apce para um só
    }
}

export = QuestionToken;