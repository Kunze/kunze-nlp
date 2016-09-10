import path = require("path");
import IPartOfSpeechTagger = require("../IPartOfSpeechTagger");
import Corpus = require("../../Corpus");
import Corpora = require("../../Corpora");
import CorpusReader = require("../../CorpusReaders/CorpusReader");
import CorpusReaderPerson = require("../../CorpusReaders/CorpusReaderPerson");
import JSONCorpusReader = require("../../CorpusReaders/JSONCorpusReader");
import ViterbiTagger = require("../Tagger/ViterbiTagger");
import TransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import UnigramDatabaseFactory = require("./EmissionDatabaseFactory");

module DefaultViterbiTaggerFactory {
    export var create = (): IPartOfSpeechTagger => {
        let corpus: Corpus[] = [],
            corpusReader = new CorpusReader(),
            corpusReaderPerson = new CorpusReaderPerson(),
            jsonCorpusReader = new JSONCorpusReader();

        // for (let index = 1; index <= 31; index++) {
        //     corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/macmorpho-${index}.txt`), corpusReader))
        // }

        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/entidades_pessoas.txt`), corpusReaderPerson));
        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/macmorpho.json`), jsonCorpusReader));

        let corpora = new Corpora(...corpus);
        let unigramDatabase = UnigramDatabaseFactory.create("unigram");
        let bigramDatabase = new TransitionDatabase();

        return new ViterbiTagger(corpora, unigramDatabase, bigramDatabase);
    }
}

export = DefaultViterbiTaggerFactory;