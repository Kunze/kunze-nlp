class GrammarRule {
    constructor(private _name: string, private _matches: string[]) {
    }

    public get name(): string {
        return this._name;
    }

    public get matches(): string[] {
        return this._matches;
    }
}

export = GrammarRule;