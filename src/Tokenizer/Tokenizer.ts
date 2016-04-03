import ITokenizer = require("./ITokenizer");
import Token = require("../Token");

class Tokenizer implements ITokenizer {
    //essa regex ta uma merda
    //arrumar mais tarde
    private splitRegex: RegExp = /([^\s]+?)(\s|,|.$)/g;

    //Exemplo: Meu email é murilokunze@hotmail.com, e meu nome é Murilo.
    //["Meu", " "], ["email", " "], 
    //["é", " "], ["murilokunze@hotmail.com", ","], ["e", " "], 
    //["meu", " "], ["nome", " "], ["Murilo", "."]
    //TODO: tokenizer não está pegando um blank space depois da virgula
    public tokens(text: string): Token[] {
        let match: RegExpExecArray, matches: Token[] = [];

        while (match = this.splitRegex.exec(text)) {
            matches.push(new Token(match[1])); //"Murilo" word
            matches.push(new Token(match[2])); //" " blank space
        }

        return matches;
    }
}

export = Tokenizer;