import path = require("path");
import IPartOfSpeechTagger = require("../Interfaces/IPartOfSpeechTagger");
import Corpus = require("../../Corpus");
import Corpora = require("../../Corpora");
import CorpusReader = require("../../CorpusReaders/CorpusReader");
import EntityCorpusReader = require("../../CorpusReaders/EntityCorpusReader");
import JSONCorpusReader = require("../../CorpusReaders/JSONCorpusReader");
import HmmTagger = require("../Tagger/HmmTagger");

module DefaultHmmTaggerFactory {
    export var create = (): IPartOfSpeechTagger => {
        let corpus: Corpus[] = [],
            corpusReader = new CorpusReader(),
            personCorpusReader = new EntityCorpusReader("NPROP", ["PERSON"]),
            brazilianStatesCorpusReader = new EntityCorpusReader("NPROP", ["STATE"]),
            brazilianCitiesCorpusReader = new EntityCorpusReader("NPROP", ["CITY"]),
            jsonCorpusReader = new JSONCorpusReader();

        for (let index = 1; index <= 31; index++) {
            corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/macmorpho-${index}.txt`), corpusReader))
            //corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/json/macmorpho-${index}.json`), jsonCorpusReader));
        }

        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/json/kunze.json`), jsonCorpusReader));
        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/kunze.txt`), corpusReader));
        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/entities/person-names.txt`), personCorpusReader));
        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/entities/fruits.txt`), personCorpusReader));
        corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/entities/brazilian-states.txt`), brazilianStatesCorpusReader));
        //corpus.push(new Corpus(path.join(__dirname, `../../../../corpora/macmorpho-v3/train/txt/entities/brazilian-cities.txt`), brazilianCitiesCorpusReader));

        let corpora = new Corpora(...corpus);

        return new HmmTagger(corpora);
    }
}

export = DefaultHmmTaggerFactory;