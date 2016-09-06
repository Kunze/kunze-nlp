import Tokenizer = require("../src/Tokenizer/Tokenizer");
import assert = require('assert');

describe("Tokenizer", () => { 
    it("Generate 25 tokens", () => {
        let text = "Eu estava sendo legal com você, porém você não foi legal comigo.";
        
        let tokenizer = new Tokenizer();
        let tokens = tokenizer.tokens(text);
        assert.equal(tokens.length, 25)
    });
    
    it("Tokenize an email", function(){
       let text = "Meu email é murilokunze@hotmail.com." 
       
       let tokenizer = new Tokenizer();
       let tokens = tokenizer.tokens(text);
        
       assert.equal(tokens.length, 8);
    });
});