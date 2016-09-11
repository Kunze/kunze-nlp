import path = require("path");
import CYKParser = require("../CYKParser");
import GrammarBuilder = require("../../Parser/Grammar/GrammarBuilder");
import ParsedNode = require("../../Parser/ParsedNode");
import IParser = require("../Interfaces/IParser");
import * as fs from "fs";

module CorporaCYKParserFactory {
    var createParsedNode = (jsonObject: any) : ParsedNode => {
        var jsonNodes: ParsedNode[] = jsonObject.parsedNodes;
        var nodes : ParsedNode[] = [];

        for(let node of jsonNodes) {
            nodes.push(createParsedNode(node));
        }

        return new ParsedNode(jsonObject.text, jsonObject.tag, jsonObject.attributes, nodes);
    }

    export var create = (): Promise<IParser> => {
        var promise = new Promise<IParser>((resolve, reject) => {
            let filepath = path.join(__dirname, `../../../../corpora/SyntaticCorpus/syntatic-corpus-1.json`)
            fs.readFile(filepath, "utf-8", (error, data) => {
                let parsedNodes : ParsedNode[] = [];

                for(let jsonObject of JSON.parse(data.replace(/^\uFEFF/, ''))) {
                    parsedNodes.push(createParsedNode(jsonObject));
                }

                let grammar = GrammarBuilder.fromParsedNodes(parsedNodes);
                let parser = new CYKParser(grammar.toString());
                
                resolve(parser);
            });
        });

        return promise;
    }
}

export = CorporaCYKParserFactory;