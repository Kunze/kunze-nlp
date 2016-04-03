# kunze-automatic-question-generator
This library have been made in typescript and nodejs. It will be used for gererating automatic questions from a text in portuguese (pt-br). It is currently a simple part of a speech tagger, but further features like parsing and question generation will be developed in the near future. This library works through a corpora (corpora/macmorpho-v3/train) and uses a probabilistic bigram to solve part of the speech tags, even for unknown words. Actually I am using a brazilian portuguese corpus named Macmorpho-v3 (http://nilc.icmc.usp.br/macmorpho)

Temporary tests: http://nlp-murilokunze.rhcloud.com/

<strong>Getting part of speech tags from text</strong>

```typescript
import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");

let defaultViterbiTagger = DefaultViterbiTaggerFactory.create();
let questionGenerator = DefaultQuestionGeneratorFactory.create();

defaultViterbiTagger.generateModel().then(tagger => {
    console.time("tagger");
    
    let phrases = "A caça é ilegal. O leão caça a lebre.";
    let tokens = tagger.tag(phrases);
    let text = new Text(tokens);

    for (let phrase of text.getPhrases()) {
        console.log(phrase.toString(), `\nProbability: ${phrase.getProbability()}\n`);

        console.log("Questions:")
        for (let question of questionGenerator.generate(phrase.getTokens(false))) {
            console.log(question.toString());
        }
        console.log("-------------------------------------------\n");

        for (let token of phrase.getTokens()) {
            console.log(`word:         ${token.getWord()}`);
            console.log(`tag:          ${token.getTag()}`);
            console.log(`known word:   ${token.getKnown()}`);
            console.log(`probability:  ${token.getProbability()}`);
            console.log("-----------------------------------------");
        }
    }
    console.timeEnd("tagger");
});
```

<strong>Running on nodejs</strong>

Just run ```npm start```.

The result should be as shown below:
```
A caça é ilegal.
Probability: 0.6988733535074627

Questions:
------------------------------------------

word:         A
tag:          ART
known word:   true
probability:  0.7625080622869252
-----------------------------------------
word:         caça
tag:          N
known word:   true
probability:  0.9285714285714286
-----------------------------------------
word:         é
tag:          V
known word:   true
probability:  0.9870490286771508
-----------------------------------------
word:         ilegal
tag:          ADJ
known word:   true
probability:  1
-----------------------------------------
word:         .
tag:          END
known word:   true
probability:  1
-----------------------------------------
O leão caça a lebre.
Probability: 0.021929756414838162

Questions:
Quem caça a lebre?
O leão caça a lebre?
------------------------------------------

word:         O
tag:          ART
known word:   true
probability:  0.9394943848018602
-----------------------------------------
word:         leão
tag:          N
known word:   true
probability:  0.42857142857142855
-----------------------------------------
word:         caça
tag:          V
known word:   true
probability:  0.07142857142857142
-----------------------------------------
word:         a
tag:          ART
known word:   true
probability:  0.7625080622869252
-----------------------------------------
word:         lebre
tag:          N
known word:   true
probability:  1
-----------------------------------------
word:         .
tag:          END
known word:   true
probability:  1
-----------------------------------------
tagger: 62.479ms
```

<strong>Tagset</strong>

<table>
    <thead>
        <tr>
            <th>CLASSE GRAMATICAL</th>
            <th>ETIQUETA</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>ADJETIVO</td>
            <td>ADJ</td>
        </tr>
        <tr>
            <td>ADVÉRBIO</td>
            <td>ADV</td>
        </tr>
        <tr>
            <td>ADVÉRBIO CONECTIVO SUBORDINATIVO</td>
            <td>ADV-KS</td>
        </tr>
        <tr>
            <td>ADVÉRBIO RELATIVOSUBORDINATIVO</td>
            <td>ADV-KS-REL</td>
        </tr>
        <tr>
            <td>ARTIGO (def. ou indef.)</td>
            <td>ART</td>
        </tr>
        <tr>
            <td>CONJUNÇÃO COORDENATIVA </td>
            <td>KC</td>
        </tr>
        <tr>
            <td>CONJUNÇÃO SUBORDINATIVA</td>
            <td>KS</td>
        </tr>
        <tr>
            <td>INTERJEIÇÃO </td>
            <td>IN</td>
        </tr>
        <tr>
            <td>NOME(SUBSTANTIVO)</td>
            <td>N</td>
        </tr>
        <tr>
            <td>NOME PRÓPRIO</td>
            <td>NPROP</td>
        </tr>
        <tr>
            <td>NUMERAL</td>
            <td>NUM</td>
        </tr>
        <tr>
            <td>PARTICÍPIO</td>
            <td>PCP</td>
        </tr>
        <tr>
            <td>PALAVRA DENOTATIVA </td>
            <td>PDEN</td>
        </tr>
        <tr>
            <td>PREPOSIÇÃO</td>
            <td>PREP</td>
        </tr>
        <tr>
            <td>PRONOME ADJETIVO</td>
            <td>PROADJ</td>
        </tr>
        <tr>
            <td>PRONOME CONECTIVO SUBORDINATIVO</td>
            <td>PRO-KS</td>
        </tr>
        <tr>
            <td>PRONOME PESSOAL</td>
            <td>PROPESS</td>
        </tr>
        <tr>
            <td>PRONOME RELATIVO CONECTIVO SUBORDINATIVO</td>
            <td>PRO-KS-REL</td>
        </tr>
        <tr>
            <td>PRONOME SUBSTANTIVO</td>
            <td>PROSUB</td>
        </tr>
        <tr>
            <td>VERBO</td>
            <td>V</td>
        </tr>
        <tr>
            <td>VERBO AUXILIAR</td>
            <td>VAUX</td>
        </tr>
        <tr>
            <td>SÍMBOLO DE MOEDA CORRENTE</td>
            <td>CUR</td>
        </tr>
    </tbody>
</table>