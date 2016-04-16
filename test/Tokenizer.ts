import Tokenizer = require("../src/Tokenizer/Tokenizer");
import assert = require('assert');

describe("tokenizer", () => { 
    it("must generate 25 tokens", () => {
        let text = "Eu estava sendo legal com você, porém você não foi legal comigo.";
        
        let tokenizer = new Tokenizer();
        let tokens = tokenizer.tokens(text);
        //tokenizer não está pegando um blank space depois da virgula 
        assert.equal(tokens.length, 25)
    });
    
    it("must tokenize a email", function(){
       let text = "Meu email é murilokunze@hotmail.com." 
       
       let tokenizer = new Tokenizer();
       let tokens = tokenizer.tokens(text);
        
       assert.equal(tokens.length, 8);
    });
    
    it("must ignore empty spaces at the end of phrase", function() {
       let text = "Meu nome é Murilo     ." 
       
       let tokenizer = new Tokenizer();
       let tokens = tokenizer.tokens(text);
        
       assert.equal(tokens.length, 9);
    });
});