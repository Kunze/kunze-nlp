# kunze-automatic-question-generator
This library have been made in typescript and nodejs. It will be used for gererating automatic questions from a text in portuguese (pt-br). It is currently a simple part of a speech tagger, but further features like parsing and question generation will be developed in the near future. This library works through a corpora (corpora/macmorpho-v3/train) and uses a probabilistic bigram to solve part of the speech tags, even for unknown words. Actually I am using a brazilian portuguese corpus named Macmorpho-v3 (http://nilc.icmc.usp.br/macmorpho)

Temporary tests: http://www.murilokunze.com.br

<strong>Getting part of speech tags from text</strong>

```typescript
import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");
import DefaultCYKParserFactory = require("./Parser/Factory/DefaultCYKParserFactory");

let defaultViterbiTagger = DefaultViterbiTaggerFactory.create();
let questionGenerator = DefaultQuestionGeneratorFactory.create();
let parser = DefaultCYKParserFactory.create();

defaultViterbiTagger.generateModel().then(tagger => {
    console.time("tagger");
    
    let phrases = "O cachorro viu o homem no parque. Murilo Kunze gosta de programar.";
    let tokens = tagger.tag(phrases);
    let text = new Text(tokens);
    let grammar = `
S -> NP VP
NP -> NPROP | ART N | ART NP | ART NPROP | NP PP
VP -> V NP | V PP | V ADJ
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N | PREP V | PREP+ART V | PREP VP`;

    for (let phrase of text.getPhrases()) {
        for(let question of questionGenerator.generate(phrase.getTokens())) {
            console.log(question);
        }

        for (let token of phrase.getTokens()) {
            console.log("-----------------------------------------");
            
            console.log(`word:         ${token.getWord()}`);
            console.log(`tag:          ${token.getTag()}`);
            console.log(`known word:   ${token.getKnown()}`);
            console.log(`probability:  ${token.getProbability()}`);
        }
    }
    console.timeEnd("tagger");
});
```

<strong>Running on nodejs</strong>

Just run ```npm start```.

The result should be as shown below:
```
--------------------------------------------------
Text: O cachorro viu o homem no parque.

Questions:
Quem viu o homem no parque?
O cachorro viu o homem no parque?
----------------------------------------
word:         O
tag:          ART
known word:   true
probability:  0.26922951930994393
----------------------------------------
word:         cachorro
tag:          N
known word:   true
probability:  0.8143329241809083
----------------------------------------
word:         viu
tag:          V
known word:   true
probability:  0.07634641716111365
----------------------------------------
word:         o
tag:          ART
known word:   true
probability:  0.18582526882479022
----------------------------------------
word:         homem
tag:          N
known word:   true
probability:  0.7042879344267315
----------------------------------------
word:         no
tag:          PREP+ART
known word:   true
probability:  0.12819540639411717
----------------------------------------
word:         parque
tag:          N
known word:   true
probability:  0.27139855005460867
----------------------------------------
word:         .
tag:          END
known word:   true
probability:  0.10144980152967373
--------------------------------------------------
Text: Murilo Kunze gosta de programar.

Questions:
Quem gosta de programar?
Murilo Kunze gosta de programar?
----------------------------------------
word:         Murilo Kunze
tag:          NPROP
known word:   true
probability:  0.07437569406873772
----------------------------------------
word:         gosta
tag:          V
known word:   true
probability:  0.09714904577918276
----------------------------------------
word:         de
tag:          PREP
known word:   true
probability:  0.10937642560856944
----------------------------------------
word:         programar
tag:          V
known word:   true
probability:  0.08880982082104785
----------------------------------------
word:         .
tag:          END
known word:   true
probability:  0.02329477463103311
tagger: 45.707ms
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