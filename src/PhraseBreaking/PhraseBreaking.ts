import IPhraseBreaking = require("./IPhraseBreaking");

class PhraseBreaking implements IPhraseBreaking {
    private _phraseBreakingRegex = /(.+?[.?!])\s+|(.+?[.?!])/g;
    
    public split(text: string): string[] {
        let match: RegExpExecArray, matches: string[] = [];

        while (match = this._phraseBreakingRegex.exec(text)) {
            matches.push(match[1] || match[2]);
        }

        return matches;
    }
}

export = PhraseBreaking;