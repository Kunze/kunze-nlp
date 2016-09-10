import TaggedToken = require("./TaggedToken");

class EndToken extends TaggedToken {
	constructor() {
		super(".", "END");
	}
}

export = EndToken;