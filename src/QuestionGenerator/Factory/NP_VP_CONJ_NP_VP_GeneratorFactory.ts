// import IQuestionGenerator = require("../IQuestionGenerator");
// import DefaultCYKParserFactory = require("../../Parser/Factory/DefaultCYKParserFactory");
// import ParsedNode = require("../../ParsedNode");
// import QuestionToken = require("../QuestionToken");

// /*
//                   S
//              _________|_________
//             /                   \
//            S                    CONJP
//         /    \                 /    \
//       NP     VP               KC     S
//       |     /   \            /     /   \
//    NPROP   V     PP         e    NP     VP
//     /      |     / \            /      /   \
//  Murilo  gosta PREP V        Murilo   V     PP
//                 |    \              gosta  /  \
//                 de  nadar                PREP  V
//                                           |    |
//                                          de   correr
//     */
    
// module NP_VP_CONJ_NP_VP_GeneratorFactory {
//     export var create = (): IQuestionGenerator => {
//         let parser = DefaultCYKParserFactory.create();
//         let transformers = [
//             (parsedNode: ParsedNode) => {
//                 let question = new QuestionToken(parsedNode);

//                 return question;
//             },
//             (parsedNode: ParsedNode) => {
//                 let question = new QuestionToken(parsedNode);
//                 var results: QuestionToken[] = question.findAll("NPROP");

//                 let firstNPROP = results[0].text;
//                 let secondNPROP = results[1].text;

//                 if (firstNPROP === secondNPROP) {
//                     results[0].replaceText("Quem");
//                     results[1].erase();
//                 }
//                 else {
//                     results[0].replaceText("Quem");
//                     results[1].replaceText("quem");
//                 }
//                 //<TODO> Murilo gosta de nadar e Murilo gosta de correr.
//                 //quem gosta de nadar e correr?
//                 return question;
//             },
//         ];

//         return new NP_VP_CONJ_NPVP_Generator(parser, transformers);
//     }
// }

// export = NP_VP_CONJ_NP_VP_GeneratorFactory;