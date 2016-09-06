import ITokenizer = require("./ITokenizer");
import Token = require("../Token");

class Tokenizer implements ITokenizer {
    //essa regex ta uma merda
    //arrumar mais tarde
    private splitRegex: RegExp = /([^\s,]+)(\s|,|.$)(\s?)/g;

    //Exemplo: Meu email é murilokunze@hotmail.com, e meu nome é Murilo.
    //["Meu", " ", ""], ["email", " ", ""], 
    //["é", " ", ""], ["murilokunze@hotmail.com", ",", " "], ["e", " ", ""], 
    //["meu", " ", ""], ["nome", " ", ""], ["Murilo", ".", ""]
    public tokens(text: string): Token[] {
        let matches: RegExpExecArray, tokens: Token[] = [];

        while (matches = this.splitRegex.exec(text)) {
            //começo no zero porque o 0 é a frase inteira
            for (var index = 1; index < matches.length; index++) {
                var match = matches[index];

                if (match) {
                    tokens.push(new Token(match));
                }
            }
        }

        return tokens;
    }
}

export = Tokenizer;