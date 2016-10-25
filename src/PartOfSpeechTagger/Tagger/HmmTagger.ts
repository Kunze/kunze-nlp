import Corpora = require("../../Corpora");
import PhraseBreaking = require("../../PhraseBreaking/PhraseBreaking");
import Tokenizer = require("../../Tokenizer/Tokenizer");
import IPartOfSpeechTagger = require("../Interfaces/IPartOfSpeechTagger");
import ProbabilityToken = require("../../PartOfSpeechTagger/ProbabilityToken");
import TransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import TaggedToken = require("../../PartOfSpeechTagger/TaggedToken");
import BlankSpaceProbabilityToken = require("../../PartOfSpeechTagger/BlankSpaceProbabilityToken");
import Token = require("../../Token");
import EmissionDatabaseFactory = require("../Factory/EmissionDatabaseFactory");
import TransitionDatabaseFactory = require("../Factory/TransitionDatabaseFactory");

class HmmTagger implements IPartOfSpeechTagger {
    private _sentence = new PhraseBreaking();
    private _tokenizer = new Tokenizer();
    private _emissions = EmissionDatabaseFactory.create("emission");
    private _transitions = TransitionDatabaseFactory.create("transition");
    //private _transitions = new TransitionDatabase();
    private OPEN_CLASS = ["ADJ", "ADV", "N", "NPROP", "PCP", "V"];

    constructor(private _corpora: Corpora) {

    }

    public generateModel(): Promise<IPartOfSpeechTagger> {
        var index = 0;
        var promise = new Promise<IPartOfSpeechTagger>((resolve, reject) => {
            this._corpora.getTokens().then((tokens) => {
                for (var index = 0; index < tokens.length; index++) {
                    var first = tokens[index];
                    var second = tokens[index + 1];

                    if(first.isStartEntityTag()) {
                        this._emissions.add(second);
                        index++;
                        continue;
                    }

                    //não adiciono as tags START
                    if (!(first.isStartTag())) {
                        this._emissions.add(first);
                    }

                    if (second) {
                        if (second.isEndPoint()) {
                            index++;

                            this._emissions.add(second);
                        }

                        this._transitions.add(first, second);
                    }
                }

                resolve(this);
            });
        });

        return promise;
    }

    /*
        arrayOfProbabilityTokens = ["N", "NPROP"], ["V", "VAUX"], ["PREP", "PREP+ART"]
    */
    private applyViterbi(arrayOfProbabilityTokens: ProbabilityToken[][]): ProbabilityToken[] {
        var copy = arrayOfProbabilityTokens.slice();

        var process = (results: ProbabilityToken[][], arrayOfProbabilityTokens: ProbabilityToken[][]) => {
            if (!arrayOfProbabilityTokens.length) {
                //só haverá 1 resultado se o último token for um END
                var mostlyProbableTokens = results[0];
                mostlyProbableTokens.shift(); //removo o START

                return mostlyProbableTokens;
            }

            var next: ProbabilityToken[];
            while (arrayOfProbabilityTokens.length) {
                var array = arrayOfProbabilityTokens[0];
                if (array.find(probabilityToken => {
                    return probabilityToken.isBlankSpace()
                })) {
                    arrayOfProbabilityTokens.shift();
                    continue;
                }

                next = arrayOfProbabilityTokens.shift();
                break;
            }

            var possibleTags: ProbabilityToken[][] = [];
            for (let firstProbabilityToken of results) { // ["N", "NPROP"]
                var lastTagOfPreviousTokens = firstProbabilityToken[firstProbabilityToken.length - 1].getTag();
                var transitions = this._transitions.get(lastTagOfPreviousTokens);

                for (let secondProbabilityTokenx of next) { // ["V", "VAUX"]
                    var secondProbabilityToken = secondProbabilityTokenx.copy();
                    var transitionProbability = transitions.getProbability(secondProbabilityToken.getTag());

                    if (transitionProbability) {
                        secondProbabilityToken.applyTransition(transitionProbability);

                        var possibleTag: ProbabilityToken[] = [...firstProbabilityToken, secondProbabilityToken];

                        var result = possibleTags.find(result => {
                            return result[result.length - 1].getTag() === secondProbabilityToken.getTag();
                        });

                        if (result) {
                            if (result[result.length - 1].getProbability() > secondProbabilityToken.getProbability()) {
                                continue;
                            }

                            //sobreescrevo o resultado
                            result = possibleTag;
                        }
                        else {
                            possibleTags.push(possibleTag);
                        }
                    }
                }
            }

            return process(possibleTags, arrayOfProbabilityTokens);
        };

        let startToken = new ProbabilityToken("", "START", [], 1, true);

        return process([[startToken]], copy);
    }

    private getOpenClassProbabilityTokens(word: string): ProbabilityToken[] {
        let tokens: ProbabilityToken[] = [];
        //<TODO> fazer smoothing para as open_class
        this.OPEN_CLASS.forEach(openClass => {
            tokens.push(new ProbabilityToken(word, openClass, [], 1, false))
        });

        return tokens;
    }

    private applyEntityRecognizer(tokens: Token[]) {
        for (var firstIndex = 0; firstIndex < tokens.length; firstIndex++) {
            var firstWord = tokens[firstIndex];
            if (firstWord.isBlankSpace()) {
                continue;
            }

            var wordTokens = [firstWord.getWord()];

            for (var secondIndex = firstIndex + 1; (secondIndex < tokens.length); secondIndex++) {
                var nextToken = tokens[secondIndex];
                wordTokens.push(nextToken.getWord());

                if (nextToken.isBlankSpace()) {
                    continue;
                };

                let words = wordTokens.join(""), entity;
                if (entity = this._emissions.get(words)) {
                    var removeCount = (secondIndex - firstIndex) + 1;
                    tokens.splice(firstIndex, removeCount, new Token(words));
                };
            }
        }
    }

    public tag(text: string): ProbabilityToken[][] {
        let phrases = this._sentence.split(text), tokenResults: ProbabilityToken[][] = [];
        for (let phrase of phrases) {
            let arrayOfProbabilityTokens: ProbabilityToken[][] = []; //all unigram possible paths
            let tokens = this._tokenizer.tokens(phrase.trim());

            this.applyEntityRecognizer(tokens);

            for (let token of tokens) {
                if (token.isBlankSpace()) {
                    arrayOfProbabilityTokens.push([new BlankSpaceProbabilityToken()]);
                    continue;
                }

                let tags: ProbabilityToken[] = [];
                let word = token.getWord();
                let unigram = this._emissions.get(word);

                if (unigram) {
                    tags = unigram.getProbabilityTokens(word);
                } else {
                    //unknow words
                    tags = this.getOpenClassProbabilityTokens(word)
                }

                arrayOfProbabilityTokens.push(tags);
            }

            // var sum = 1;
            // for (let i of arrayOfProbabilityTokens) {
            //     sum *= i.length;
            // }
            // console.log(`Número total de combinações: ${sum}`);

            var mostProbablyTokens: ProbabilityToken[] = this.applyViterbi(arrayOfProbabilityTokens);

            //Adiciono os blank-space
            for (var index = 0; index < arrayOfProbabilityTokens.length; index++) {
                let isBlankSpace = arrayOfProbabilityTokens[index].find((e) => {
                    return e.isBlankSpace();
                });

                if (isBlankSpace) {
                    mostProbablyTokens.splice(index, 0, new BlankSpaceProbabilityToken)
                }
            }

            tokenResults.push(mostProbablyTokens);
        }

        return tokenResults;
    }
}

export = HmmTagger;