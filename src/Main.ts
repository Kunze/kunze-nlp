import DefaultHmmTaggerFactory = require("./PartOfSpeechTagger/Factory/DefaultHmmTaggerFactory");
import DefaultQuestionGeneratorFactory = require("./QuestionGenerator/Factory/DefaultQuestionGeneratorFactory");
import CorporaCYKParserFactory = require("./Parser/Factory/CorporaCYKParserFactory");
import Text = require("./Text");
import TaggedToken = require("./PartOfSpeechTagger/TaggedToken");

// import ParsedNode = require("./Parser/ParsedNode");
// console.log(JSON.stringify(new ParsedNode("Em muitos locais do brasil.", "PP", [], [
//         new ParsedNode("Em", "PREP", [], []),
//         new ParsedNode("muitos locais do brasil.", "NP", [], [
//             new ParsedNode("muitos", "PROSUB", []),
//             new ParsedNode("locais do brasil.", "NP", []),
//         ]),
//     ])
// ));

let questionGenerator = DefaultQuestionGeneratorFactory.create();
CorporaCYKParserFactory.create().then((parser) => {
    console.time("generateModel")
    DefaultHmmTaggerFactory.create().generateModel().then(tagger => {
        console.timeEnd("generateModel");
        console.time("tagger");

        let phrases = `O código florestal brasileiro apresenta muitas formas de conservar as florestas, destacando cuidados com os mananciais (nascentes), as margens dos cursos dos rios, as espécies ameaçadas de extinção, regiões de mangues e outros ambientes de grande fragilidade.
Se conhecermos mais sobre as plantas e os hábitos dos bichos, podemos entender como todos os seres vivos se relacionam. Qual a consequência, por exemplo, da extinção de determinada espécie de roedor ou da árvore frutífera? Será que há desequilíbrio ecológico?
Uma iniciativa indispensável para conservar a floresta é manter as árvores. Mas e quando elas já foram derrubadas, será que não podemos fazer nada? Podemos, sim, ajudar no reflorestamento plantando espécies relacionadas com o local destruído. Por isso, antes de plantar a sua semente, procure se informar com os órgãos ambientais  se a árvore que vai brotar ficará bem no local que você escolheu.
A poluição dos rios e das florestas é um problema ambiental de consequências graves. Portanto, em passeios ao ar livre, cuide pra que o seu lixo volte para casa com você e tenha o destino adequado.
Você, com toda certeza, é incapaz de maltratar animais e de pisar ou arrancar plantas. Mas sabia que, muitas vezes, gestos que parecem legais, como alimentar micos e outros animais silvestres, podem prejudicar essas espécies? Longe da floresta e perto da oferta de comida sem esforço, eles podem desaprender a conseguir o próprio alimento. Aí, tornam-se presas fáceis ou invadem espaços urbanos para conseguir o que comer.
Uma fogueira, um fósforo aceso, um cigarro jogado na estrada perto da mata...
Tudo isso pode provocar queimadas e devastar grandes áreas de floresta.
Muitas matas são protegidas por leis ambientais. Derrubar árvores ou extrair qualquer outro tipo de vegetação desses locais é proibido. Essa prática deve ser denunciada pelos telefones disponibilizados por órgãos de proteção ambiental.
A caça ou captura de animais silvestres para futura comercialização é proibida em muitos locais do brasil. Se souber que estão driblando essa lei na sua região, peça a ajuda de um adulto para fazer uma denúncia por telefone às autoridades ambientais.
As madeiras autorizadas a serem utilizadas na produção de móveis e papel recebem um selo de que estão de acordo com as leis ambientais. Logo, ao comprar produtos derivados da madeira, procure por esse selo. Ele é a garantia de que houve reflorestamento da área em que a madeira foi extraída.
Essa tarefa é fácil e você já sabe bastante sobre o assunto. Então, coloque a boca no trombone e ajude na conservação das florestas.`;
        let tokens = tagger.tag(phrases.trim());
        let text = new Text(tokens);

        for (let phrase of text.getPhrases()) {
            console.log("-".repeat(50));
            console.log(`Text: ${phrase.toString()} \n`)
            console.log("Questions:")

            let cykTable = parser.parse(phrase.getTokens());

            for (let question of questionGenerator.generate(cykTable)) {
                console.log(question);
            }

            for (let token of phrase.getTokens()) {
                console.log("-".repeat(40));
                console.log(`word:         ${token.getWord()}`);
                console.log(`tag:          ${token.getTag()}`);
                console.log(`known word:   ${token.getKnown()}`);
                console.log(`probability:  ${token.getProbability()}`);

                if (token.hasAttributes()) {
                    console.log(`attribute:    ${token.getAttributes()}`);
                }
            }
        }
        console.timeEnd("tagger");
    });
});
