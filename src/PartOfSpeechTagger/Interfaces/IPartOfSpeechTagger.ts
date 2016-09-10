import ProbabilityToken = require("../../PartOfSpeechTagger/ProbabilityToken");

interface IPartOfSpeechTagger {
    tag(word: string): ProbabilityToken[];
    generateModel(): Promise<IPartOfSpeechTagger>;
}

export = IPartOfSpeechTagger;