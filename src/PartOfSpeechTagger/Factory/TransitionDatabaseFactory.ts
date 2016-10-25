import TransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import TransitionCounter = require("../Counters/TransitionCounter");
import Loki = require("lokijs");

module TransitionDatabaseFactory {
    export var create = (databaseName: string): TransitionDatabase => {
        var db = new Loki(`${databaseName}.json`);
        db.addCollection<TransitionCounter>("transition").ensureUniqueIndex("id");
        
        return new TransitionDatabase(db);
    }
}

export = TransitionDatabaseFactory;