import TaggedToken = require("./TaggedToken");

class StartEntityToken extends TaggedToken {
	constructor() {
		super("", "START_ENTITY");
	}
}

export = StartEntityToken;