import TaggedToken = require("../PartOfSpeechTagger/TaggedToken");
import ICorpusReader = require("./Interfaces/ICorpusReader");
import StartEntityToken = require("../PartOfSpeechTagger/StartEntityToken");
import EndToken = require("../PartOfSpeechTagger/EndToken");

class EntityCorpusReader implements ICorpusReader {
    constructor(private tag: string, private attributes: string[]) {

    }

    public read(text: string): TaggedToken[] {
        let tokens: TaggedToken[] = [];

        for (let person of text.trim().split("\n")) {
            tokens.push(new StartEntityToken());
            //faço um slice para evitar que os outros tokens usem a msm referencia em memoria
            tokens.push(new TaggedToken(person.replace("\r", ""), this.tag, this.attributes.slice()));
        }

        return tokens;
    }
}

export = EntityCorpusReader;