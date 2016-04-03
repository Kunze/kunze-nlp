import PhraseBreaking = require("../src/PhraseBreaking/PhraseBreaking");
import assert = require('assert');

describe("PhraseBreaking", () => {
    let text = `
O site do google é google.com. Outra frase qualquer.    
Meu nome é Murilo.   Meu sobrenome é Kunze. 
Qual seu nome? Meu nome é Murilo! Já te falei isso.
Outra frase qualquer.`;
    let phraseBreaking = new PhraseBreaking();
    let phrases = phraseBreaking.split(text);

    it("must break into 8 phrases", () => {
        assert.equal(phrases.length, 8);
    });

    it("must break into correct phrases", () => {
        assert.equal(phrases[0], "O site do google é google.com.");
        assert.equal(phrases[1], "Outra frase qualquer.");
        assert.equal(phrases[2], "Meu nome é Murilo.");
        assert.equal(phrases[3], "Meu sobrenome é Kunze.");
        assert.equal(phrases[4], "Qual seu nome?");
        assert.equal(phrases[5], "Meu nome é Murilo!");
        assert.equal(phrases[6], "Já te falei isso.");
        assert.equal(phrases[7], "Outra frase qualquer.");
    });
});