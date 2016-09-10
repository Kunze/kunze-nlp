class MatchTag {
    private count = 1;
    constructor(private tag: string, private attributes: string[]) {

    }

    public addAttributes(attributes: string[]) {
        for(let attribute of attributes) {
            if(this.attributes.indexOf(attribute) > 0) {
                continue;
            }

            this.attributes.push(attribute);
        }
    }

    public getAttributes() {
        return this.attributes;
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