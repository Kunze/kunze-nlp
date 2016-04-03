class MatchTag {
    private count = 1;
    constructor(private tag: string) {

    }

    public getTag() {
        return this.tag;
    }

    public getCount() {
        return this.count;
    }

    public addOne() {
        this.count += 1;
    }
}

export = MatchTag;