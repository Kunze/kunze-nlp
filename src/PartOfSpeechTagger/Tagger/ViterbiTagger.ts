import Corpora = require("../../Corpora");
import PhraseBreaking = require("../../PhraseBreaking/PhraseBreaking");
import Tokenizer = require("../../Tokenizer/Tokenizer");
import IPartOfSpeechTagger = require("../IPartOfSpeechTagger");
import ProbabilityToken = require("../../ProbabilityToken");
import ITransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import IEmissionDatabase = require("../InMemoryDatabase/EmissionDatabase");
import TaggedToken = require("../../TaggedToken");
import BlankSpaceProbabilityToken = require("../../BlankSpaceProbabilityToken");
import Token = require("../../Token");

class ViterbiTagger implements IPartOfSpeechTagger {
    private _sentence = new PhraseBreaking();
    private _tokenizer = new Tokenizer();
    private OPEN_CLASS = ["ADJ", "ADV", "N", "NPROP", "PCP", "V"];
    // private CLOSED_CLASS = ["START", "PREP+PROADJ", "PREP+ART", "PREP+PROPERS",
    //     "PREP\+PROSUB", "PRO-KS", "ADV-KS-REL", "ADV-KS",
    //     "PROADJ", "PU", "PREP", "PROPESS", "PROSUB", "VAUX", "PDEN", "KS", "ART", "KC", "END"];

    constructor(private _corpora: Corpora,
        private _emissions: IEmissionDatabase,
        private _transitions: ITransitionDatabase) {
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
                var transitions = this._transitions.get(firstProbabilityToken[firstProbabilityToken.length -1].getTag());

                for (let secondProbabilityTokenx of next) { // ["V", "VAUX"]
                    var secondProbabilityToken = secondProbabilityTokenx.copy();
                    var transitionToSecondTag = transitions.getTag(secondProbabilityToken.getTag());

                    if (transitionToSecondTag) {
                        secondProbabilityToken.applyTransition(transitions);

                        var possibleTag: ProbabilityToken[] = [...firstProbabilityToken, secondProbabilityToken];

                        var result = possibleTags.find(result => {
                            return result[result.length -1].getTag() === secondProbabilityToken.getTag();
                        });

                        if (result) {
                            if (result[result.length -1].getProbability() > secondProbabilityToken.getProbability()) {
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

        let startToken = new ProbabilityToken("", "START", 1, true);

        return process([[startToken]], copy);
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

            //adiciono os blank-space
            for (let emission of arrayOfProbabilityTokens) {
                let isBlankSpace = emission.find((e) => {
                    return e.isBlankSpace();
                });

                if (isBlankSpace) {
                    tokenResults.push(new BlankSpaceProbabilityToken())
                }
                else {
                    tokenResults.push(mostProbablyTokens.shift());
                }
            }
        }

        return tokenResults;
    }
}

export = ViterbiTagger;