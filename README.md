# kunze-automatic-question-generator
This library have been made in typescript and nodejs. It will be used for gererating automatic questions from a text in portuguese (pt-br). It is currently a simple part of a speech tagger, but further features like parsing and question generation will be developed in the near future. This library works through a corpora (corpora/macmorpho-v3/train) and uses a probabilistic bigram to solve part of the speech tags, even for unknown words. Actually I am using a brazilian portuguese corpus named Macmorpho-v3 (http://nilc.icmc.usp.br/macmorpho)

Temporary tests: http://www.murilokunze.com.br

<strong>Getting part of speech tags from text</strong>

```typescript
import DefaultViterbiTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultViterbiTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import CorporaCYKParserFactory = require("./Parser/Factory/CorporaCYKParserFactory");
import Text = require("./Text");
import TaggedToken = require("./TaggedToken");
import CYKTable = require("./Parser/CYKTable");

let questionGenerator = DefaultQuestionGeneratorFactory.create();
CorporaCYKParserFactory.create().then((parser) => {
    DefaultViterbiTaggerFactory.create().generateModel().then(tagger => {
        console.time("tagger");

        let phrases = "Murilo Kunze gosta de programar sozinho de noite.";
        let tokens = tagger.tag(phrases);
        let text = new Text(tokens);

        for (let phrase of text.getPhrases()) {
            console.log("-".repeat(50));
            console.log(`Text: ${phrase.toString()} \n`)
            console.log("Questions:")

            let cykTable: CYKTable = parser.parse(phrase.getTokens());

            for (let question of questionGenerator.generate(cykTable)) {
                console.log(question);
            }

            for (let token of phrase.getTokens()) {
                console.log("-".repeat(40));

                console.log(`word:         ${token.getWord()}`);
                console.log(`tag:          ${token.getTag()}`);
                console.log(`known word:   ${token.getKnown()}`);
                console.log(`probability:  ${token.getProbability()}`);
            }
        }
        console.timeEnd("tagger");
    });
});
```

<strong>Running on nodejs</strong>

Just run ```npm start```.

The result should be as shown below:
```
Text: Murilo Kunze gosta de programar sozinho de noite.

Questions:
Quem gosta de programar?
Qual o nome da pessoa que gosta de programar?
Murilo Kunze gosta de programar?
----------------------------------------
word:         Murilo Kunze
tag:          NPROP
known word:   true
probability:  0.07448322988440294
----------------------------------------
word:         gosta
tag:          V
known word:   true
probability:  0.0971433588948077
----------------------------------------
word:         de
tag:          PREP
known word:   true
probability:  0.10937787990826241
----------------------------------------
word:         programar
tag:          V
known word:   true
probability:  0.08880982082104785
----------------------------------------
word:         sozinho
tag:          ADJ
known word:   true
probability:  0.03734058192619177
----------------------------------------
word:         de
tag:          PREP
known word:   true
probability:  0.11378864211986091
----------------------------------------
word:         noite
tag:          N
known word:   true
probability:  0.3886058596720611
----------------------------------------
word:         .
tag:          END
known word:   true
probability:  0.10145041539848605
tagger: 40.990ms

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