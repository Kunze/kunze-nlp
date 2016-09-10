import TaggedToken = require("../PartOfSpeechTagger/TaggedToken");
import ICorpusReader = require("./Interfaces/ICorpusReader");
import StartToken = require("../PartOfSpeechTagger/StartToken");
import EndToken = require("../PartOfSpeechTagger/EndToken");

class CorpusReaderPerson implements ICorpusReader {
	public read(text: string): TaggedToken[] {
		let tokens: TaggedToken[] = [];
		
        for(let person of text.trim().split("\n")) {
            tokens.push(new StartToken());
            tokens.push(new TaggedToken(person.replace("\r", ""), "NPROP", ["PERSON", "PERSON2"]));
            tokens.push(new EndToken());
        }

		return tokens;
	}
}

export = CorpusReaderPerson;