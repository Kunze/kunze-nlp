import ParsedNode = require("./ParsedNode");

class CYKTable {
    constructor(private parsedNodes: ParsedNode[][][]) {

    }

    public getNodes(): ParsedNode[] {
        let nodes: ParsedNode[] = [];

        for (var index = this.parsedNodes.length - 1; index > 2; index--) {
            var tableLine = this.parsedNodes[index];

            for (let parsedNodes of tableLine) {
                for (let parsedNode of parsedNodes) {
                    nodes.push(parsedNode);
                }
            }
        }

        return nodes;
    }

    public getTrees(): ParsedNode[] {
        //retorna várias árvores
        let trees = this.parsedNodes[this.parsedNodes.length - 1][0];

        if (trees.length) {
            return trees;//última linha da tabela (podendo conter vários resultados)
        }
    }
}

export = CYKTable;