import TaggedToken = require("../TaggedToken");
import ICorpusReader = require("../ICorpusReader");

class CorpusReaderPerson implements ICorpusReader {
	public read(text: string): TaggedToken[] {
		let tokens: TaggedToken[] = [];
		
        for(let person of text.trim().split("\n")) {
            tokens.push(new TaggedToken(person, "NPROP", "PERSON"));   
        }

		return tokens;
	}
}

export = CorpusReaderPerson;