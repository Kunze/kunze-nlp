import TaggedToken = require("../PartOfSpeechTagger/TaggedToken");
import StartToken = require("../PartOfSpeechTagger/StartToken");
import ICorpusReader = require("./Interfaces/ICorpusReader");

class CorpusReader implements ICorpusReader {
    private _sentenceBreaking: RegExp = /(.*?_END)\s*/g;
    private _tagBreaking: RegExp = /(.*?)_((NPROP)#(PERSON)|(N)#(LOCATION|CHARACTER)|PREP\+PROADJ|PREP\+ART|PREP\+PROPERS|PREP\+PROSUB|PRO-KS|ADV-KS-REL|ADV-KS|CUR|NPROP|PROADJ|PU|PCP|PREP|PROPESS|PROSUB|VAUX|PDEN|IN|KS|NUM|N|V|ART|KC|ADV|ADJ|END)\s*/g;

    public read(text: string): TaggedToken[] {
        let sentenceExecArray: RegExpExecArray, taggedTokens: TaggedToken[] = [];
        while (sentenceExecArray = this._sentenceBreaking.exec(text)) {
            let sentenceText = sentenceExecArray[1];

            //toda frase começa com essa tag
            taggedTokens.push(new StartToken());

            let wordTagsExecArray: RegExpExecArray, lastTaggedToken: TaggedToken;
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

                /*
                Combino todos tokens N e NPROP seguidos em um só, exemplo:
                Murilo_NPROP Kunze_NPROP virá um token só Murilo Kunze_N
                */
                if(taggedToken.getTag() !== "N" && taggedToken.getTag() !== "NPROP"){
                    if(lastTaggedToken) {
                        taggedTokens.push(lastTaggedToken);
                        lastTaggedToken = null;                      
                    }
                    taggedTokens.push(taggedToken);
                    continue;
                }

                if(!lastTaggedToken) {
                    lastTaggedToken = taggedToken;
                    continue;
                }

                if(lastTaggedToken.getTag() === taggedToken.getTag()) {
                    let word = `${lastTaggedToken.getWord()} ${taggedToken.getWord()}`;

                    lastTaggedToken = new TaggedToken(word, taggedToken.getTag(), []);
                }
                else {
                    //entra aqui somente se o token anterior for NPROP e o próximo N, ou vice-versa
                    taggedTokens.push(lastTaggedToken);
                    lastTaggedToken = taggedToken;
                }
            }
        }

        return taggedTokens;
    }
}

export = CorpusReader;