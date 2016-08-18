import path = require("path");
import IPartOfSpeechTagger = require("../IPartOfSpeechTagger");
import Corpus = require("../../Corpus");
import Corpora = require("../../Corpora");
import CorpusReader = require("../../CorpusReaders/CorpusReader");
import CorpusReaderPerson = require("../../CorpusReaders/CorpusReaderPerson");
import ViterbiTagger = require("../Tagger/ViterbiTagger");
import TransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import UnigramDatabaseFactory = require("./EmissionDatabaseFactory");

module DefaultViterbiTaggerFactory {
    export var create = (): IPartOfSpeechTagger => {
        let corpus: Corpus[] = [],
            corpusReader = new CorpusReader(),
            corpusReaderPerson = new CorpusReaderPerson();

        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/testes.txt`), corpusReader));

        for (let index = 1; index <= 31; index++) {
            let filePath = path.join(__dirname, `../../../../corpora/macmorpho-v3/train/macmorpho-${index}.txt`);
            corpus.push(new Corpus(filePath, corpusReader))
        }

        let personCorpusPath = path.join(__dirname, `../../../../corpora/macmorpho-v3/train/entidades_pessoas.txt`);
        corpus.push(new Corpus(personCorpusPath, corpusReaderPerson));
        
        let corpora = new Corpora(...corpus);
        let unigramDatabase = UnigramDatabaseFactory.create("unigram");
        let bigramDatabase = new TransitionDatabase();

        return new ViterbiTagger(corpora, unigramDatabase, bigramDatabase);
    }
}

export = DefaultViterbiTaggerFactory;