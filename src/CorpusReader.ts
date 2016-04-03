import TaggedToken = require("./TaggedToken");
import StartToken = require("./StartToken");
import ICorpusReader = require("./ICorpusReader");

class CorpusReader implements ICorpusReader {
	private _sentenceBreaking: RegExp = /(.*?_END)\s*/g;
	private _tagBreaking: RegExp = /(.*?)_(PREP\+PROADJ|PREP\+ART|PREP\+PROPERS|PREP\+PROSUB|PRO-KS|ADV-KS-REL|ADV-KS|CUR|NPROP|PROADJ|PU|PCP|PREP|PROPESS|PROSUB|VAUX|PDEN|IN|KS|N|V|ART|KC|NUM|ADV|ADJ|END)\s*/g;

	public read(text: string): TaggedToken[] {
		let sentenceExecArray: RegExpExecArray, tokens: TaggedToken[] = [];
		while (sentenceExecArray = this._sentenceBreaking.exec(text)) {
			let sentenceText = sentenceExecArray[1];
			
			//toda frase começa com essa tag
			tokens.push(new StartToken());
			
			let wordTagsExecArray: RegExpExecArray;
			while (wordTagsExecArray = this._tagBreaking.exec(sentenceText)) {
                //converto tudo para minusculo
				let tag: TaggedToken = new TaggedToken(wordTagsExecArray[1], wordTagsExecArray[2]);

				tokens.push(tag);
			}
		}

		return tokens;
	}
}

export = CorpusReader;