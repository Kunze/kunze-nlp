import Corpora = require("../../Corpora");
import PhraseBreaking = require("../../PhraseBreaking/PhraseBreaking");
import Tokenizer = require("../../Tokenizer/Tokenizer");
import IPartOfSpeechTagger = require("../IPartOfSpeechTagger");
import ProbabilityToken = require("../../ProbabilityToken");
import ITransitionDatabase = require("../InMemoryDatabase/ITransitionDatabase");
import IEmissionDatabase = require("../InMemoryDatabase/IEmissionDatabase");
import TaggedToken = require("../../TaggedToken");
import IFeature = require("../Features/IFeature");
import Feature = require("../Features/Feature");
import BlankSpaceProbabilityToken = require("../../BlankSpaceProbabilityToken");
import Token = require("../../Token");

interface Data {
    tokens: ProbabilityToken[],
    lastTag: ProbabilityToken,
    probability: number
}

class ViterbiTagger implements IPartOfSpeechTagger {
    private _sentence = new PhraseBreaking();
    private _tokenizer = new Tokenizer();
    private OPEN_CLASS = ["ADJ", "ADV", "N", "NPROP", "PCP", "V"];
    // private CLOSED_CLASS = ["START", "PREP+PROADJ", "PREP+ART", "PREP+PROPERS",
    //     "PREP\+PROSUB", "PRO-KS", "ADV-KS-REL", "ADV-KS",
    //     "PROADJ", "PU", "PREP", "PROPESS", "PROSUB", "VAUX", "PDEN", "KS", "ART", "KC", "END"];
    private features: IFeature[] = [];

    constructor(private _corpora: Corpora,
        private _emissions: IEmissionDatabase,
        private _transitions: ITransitionDatabase) {
        this.features = [
            new Feature()
        ]
    }

    public generateModel(): Promise<IPartOfSpeechTagger> {
        var index = 0;
        var promise = new Promise<IPartOfSpeechTagger>((resolve, reject) => {
            this._corpora.getTokens().then((tokens) => {
                for (var index = 0; index < tokens.length; index++) {
                    var first = tokens[index];
                    var second = tokens[index + 1];

                    if (!first.isStartTag()) {
                        this._emissions.add(first);
                    }

                    //se a ultima palavra for uma entity, não haverá "second"
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
    private applyViterbi(arrayOfProbabilityTokens: ProbabilityToken[][]): Data {
        var process = (results: Data[], arrayOfProbabilityTokens: ProbabilityToken[][]) => {
            if (!arrayOfProbabilityTokens.length) {
                return results[0];
            }

            var first: Data[] = results;
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

            var possibleTags: Data[] = [];
            for (let firstProbabilityToken of first) { // ["N", "NPROP"]
                var lastT = firstProbabilityToken.tokens[firstProbabilityToken.tokens.length - 1];

                for (let secondProbabilityTokenx of next) { // ["V", "VAUX"]
                    var secondProbabilityToken = secondProbabilityTokenx.copy();
                    var transitions = this._transitions.get(firstProbabilityToken.lastTag.getTag());
                    var transitionToSecondTag = transitions.getTag(secondProbabilityToken.getTag());

                    if (transitionToSecondTag) {
                        secondProbabilityToken.applyTransition(transitions);

                        var possibleTag: Data = {
                            tokens: [...firstProbabilityToken.tokens, secondProbabilityToken],
                            lastTag: secondProbabilityToken,
                            probability: secondProbabilityToken.getProbability()
                        };
                        var result = possibleTags.find(result => {
                            return result.lastTag.getTag() === secondProbabilityToken.getTag();
                        });

                        if (result) {
                            if (result.probability > secondProbabilityToken.getProbability()) {
                                continue;
                            }

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

        var temporaryTokens = arrayOfProbabilityTokens.slice(0),
            firstProbabilityTokens = temporaryTokens.shift(),
            results: Data[] = [];

        var startTag = this._transitions.get("START");

        for (let firstProbabilityToken of firstProbabilityTokens) {
            var transitionToSecondTag = startTag.getTag(firstProbabilityToken.getTag());

            if (transitionToSecondTag) {
                firstProbabilityToken.applyTransition(startTag);

                results.push({
                    tokens: [firstProbabilityToken],
                    lastTag: firstProbabilityToken,
                    probability: firstProbabilityToken.getProbability()
                });
            }
        }

        return process(results, temporaryTokens);
    }

    private getOpenClassProbabilityTokens(word: string): ProbabilityToken[] {
        let tokens: ProbabilityToken[] = [];
        //<TODO> fazer smoothing para as open_class
        this.OPEN_CLASS.forEach(openClass => {
            tokens.push(new ProbabilityToken(word, openClass, 1, false))
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
            var stopIndex = firstIndex + 5; //não quero checar todas as combinações

            for (var secondIndex = firstIndex + 1; (secondIndex < tokens.length) && (secondIndex < stopIndex); secondIndex++) {
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

    public tag(text: string): ProbabilityToken[] {
        let phrases = this._sentence.split(text), tokenResults = [];
        for (let phrase of phrases) {
            let arrayOfProbabilityTokens: ProbabilityToken[][] = []; //all unigram possible paths
            let tokens = this._tokenizer.tokens(phrase);

            this.applyEntityRecognizer(tokens);

            for (let token of tokens) {
                if (token.isBlankSpace()) {
                    arrayOfProbabilityTokens.push([new BlankSpaceProbabilityToken()]);
                    continue;
                }

                let tags: ProbabilityToken[] = [];
                let word = token.getWord();
                let unigram = this._emissions.get(word);

                //pego todas as classes gramaticais para uma palavra e adiciono num array de classes
                if (unigram) {
                    unigram.getProbabilityTokens(word).forEach(probabilityToken => {
                        tags.push(probabilityToken);
                    });
                } else {
                    this.getOpenClassProbabilityTokens(word).forEach(closedTag => {
                        tags.push(closedTag);
                    });
                }

                arrayOfProbabilityTokens.push(tags);
            }

            var sum = 1;
            for (let i of arrayOfProbabilityTokens) {
                sum *= i.length;
            }
            console.log(`Número total de combinações: ${sum}`);

            var mostProbablyTags = this.applyViterbi(arrayOfProbabilityTokens);

            //adiciono os blank-space
            for (let emission of arrayOfProbabilityTokens) {
                let isBlankSpace = emission.find((e) => {
                    return e.isBlankSpace();
                });

                if (isBlankSpace) {
                    tokenResults.push(new BlankSpaceProbabilityToken())
                }
                else {
                    tokenResults.push(mostProbablyTags.tokens.shift());
                }
            }
        }

        return tokenResults;
    }

    // private applyFeatures(probabilityTokens: ProbabilityToken[],
    //     arrayOfProbabilityTokens: ProbabilityToken[][],
    //     results: ProbabilityToken[][]): boolean {
    //     let apply = false;
    //     for (let feature of this.features) {
    //         if (feature.apply(probabilityTokens, arrayOfProbabilityTokens, results)) {
    //             apply = true;
    //         }
    //     }

    //     return apply;
    // }
}

export = ViterbiTagger;