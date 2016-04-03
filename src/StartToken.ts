import TaggedToken = require("./TaggedToken");

class StartToken extends TaggedToken {
	constructor() {
		super("", "START");
	}
}

export = StartToken;