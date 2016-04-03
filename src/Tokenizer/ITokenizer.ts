import Token = require("../Token");

interface ITokenizer {
	tokens(text: string): Token[]
}

export = ITokenizer;