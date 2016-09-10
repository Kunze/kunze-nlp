import TaggedToken = require("../TaggedToken");
import StartToken = require("../StartToken");
import ICorpusReader = require("../ICorpusReader");

class CorpusReader implements ICorpusReader {
    private _sentenceBreaking: RegExp = /(.*?_END)\s*/g;
    private _tagBreaking: RegExp = /(.*?)_((NPROP)#(PERSON)|(N)#(LOCATION|CHARACTER)|PREP\+PROADJ|PREP\+ART|PREP\+PROPERS|PREP\+PROSUB|PRO-KS|ADV-KS-REL|ADV-KS|CUR|NPROP|PROADJ|PU|PCP|PREP|PROPESS|PROSUB|VAUX|PDEN|IN|KS|N|V|ART|KC|NUM|ADV|ADJ|END)\s*/g;

    public read(text: string): TaggedToken[] {
        let sentenceExecArray: RegExpExecArray, taggedTokens: TaggedToken[] = [];
        while (sentenceExecArray = this._sentenceBreaking.exec(text)) {
            let sentenceText = sentenceExecArray[1];

            //toda frase começa com essa tag
            taggedTokens.push(new StartToken());

            let wordTagsExecArray: RegExpExecArray;
            while (wordTagsExecArray = this._tagBreaking.exec(sentenceText)) {
                //converto tudo para minusculo
                let word = wordTagsExecArray[1];
                let taggedToken: TaggedToken;
                if (wordTagsExecArray.length === 5) {
                    //se for entity
                    var tag = wordTagsExecArray[3];
                    var entity = wordTagsExecArray[4];
                    
                    taggedToken = new TaggedToken(word, tag, [entity]);
                }
                else {
                    let tag = wordTagsExecArray[2];
                    
                    taggedToken = new TaggedToken(word, tag);
                }
                
                taggedTokens.push(taggedToken);
            }
        }

        return taggedTokens;
    }
}

export = CorpusReader;