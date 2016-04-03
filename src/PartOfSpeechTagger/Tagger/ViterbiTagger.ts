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

                    if (second.isEndPoint()) {
                        index++;

                        this._emissions.add(second);
                    }

                    this._transitions.add(first, second);
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

    public tag(text: string): ProbabilityToken[] {
        let phrases = this._sentence.split(text), tokenResults = [];
        for (let phrase of phrases) {
            let arrayOfProbabilityTokens: ProbabilityToken[][] = []; //all unigram possible paths
            for (let token of this._tokenizer.tokens(phrase)) {
                if (token.isBlankSpace()) {
                    arrayOfProbabilityTokens.push([new BlankSpaceProbabilityToken()]);
                    continue;
                }

                var tags: ProbabilityToken[] = [];
                var unigram = this._emissions.get(token.getWord());

                if (unigram) {
                    unigram.getProbabilityTokens(token.getWord()).forEach(probabilityToken => {
                        tags.push(probabilityToken);
                    });
                } else {
                    this.getOpenClassProbabilityTokens(token.getWord()).forEach(closedTag => {
                        tags.push(closedTag);
                    });
                }

                arrayOfProbabilityTokens.push(tags);
            }

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