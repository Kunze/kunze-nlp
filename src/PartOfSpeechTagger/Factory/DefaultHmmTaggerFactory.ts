import path = require("path");
import IPartOfSpeechTagger = require("../Interfaces/IPartOfSpeechTagger");
import Corpus = require("../../Corpus");
import Corpora = require("../../Corpora");
import CorpusReader = require("../../CorpusReaders/CorpusReader");
import CorpusReaderPerson = require("../../CorpusReaders/CorpusReaderPerson");
import JSONCorpusReader = require("../../CorpusReaders/JSONCorpusReader");
import HmmTagger = require("../Tagger/HmmTagger");

module DefaultHmmTaggerFactory {
    export var create = (): IPartOfSpeechTagger => {
        let corpus: Corpus[] = [],
            corpusReader = new CorpusReader(),
            corpusReaderPerson = new CorpusReaderPerson(),
            jsonCorpusReader = new JSONCorpusReader();

        for (let index = 1; index <= 31; index++) {
            //corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/macmorpho-${index}.txt`), corpusReader))
            corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/json/macmorpho-${index}.json`), jsonCorpusReader));
         }

        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/json/kunze.json`), jsonCorpusReader));
        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/entidades_pessoas.txt`), corpusReaderPerson));

        let corpora = new Corpora(...corpus);

        return new HmmTagger(corpora);
    }
}

export = DefaultHmmTaggerFactory;