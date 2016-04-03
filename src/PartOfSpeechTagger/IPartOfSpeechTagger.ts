import ProbabilityToken = require("../ProbabilityToken");

interface IPartOfSpeechTagger {
    tag(word: string): ProbabilityToken[];
    generateModel(): Promise<IPartOfSpeechTagger>;
}

export = IPartOfSpeechTagger;