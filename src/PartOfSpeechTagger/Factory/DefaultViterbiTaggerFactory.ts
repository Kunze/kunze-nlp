import path = require("path");
import IPartOfSpeechTagger = require("../IPartOfSpeechTagger");
import Corpus = require("../../Corpus");
import Corpora = require("../../Corpora");
import CorpusReader = require("../../CorpusReader");
import ViterbiTagger = require("../Tagger/ViterbiTagger");
import TransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import UnigramDatabaseFactory = require("./UnigramDatabaseFactory");

module DefaultViterbiTaggerFactory {
    export var create = (): IPartOfSpeechTagger => {
        let corpus: Corpus[] = [],
            corpusReader = new CorpusReader(),
            filePaths: string[] = [];

        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/testes.txt`), corpusReader));

        for (let index = 1; index <= 31; index++) {
            let filePath = path.join(__dirname, `../../../../corpora/macmorpho-v3/train/macmorpho-${index}.txt`);
            filePaths.push(filePath);
        }

        for (let filePath of filePaths) {
            corpus.push(new Corpus(filePath, corpusReader));
        }

        let corpora = new Corpora(...corpus);
        let unigramDatabase = UnigramDatabaseFactory.create("unigram");
        let bigramDatabase = new TransitionDatabase();

        return new ViterbiTagger(corpora, unigramDatabase, bigramDatabase);
    }
}

export = DefaultViterbiTaggerFactory;