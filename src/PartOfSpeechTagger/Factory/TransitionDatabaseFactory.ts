import TransitionDatabase = require("../InMemoryDatabase/TransitionDatabase");
import Counter = require("../Counters/Counter");
import Loki = require("lokijs");

module TransitionDatabaseFactory {
    export var create = (databaseName: string): TransitionDatabase => {
        var db = new Loki(`${databaseName}.json`);
        db.addCollection<Counter>("transition").ensureUniqueIndex("id");
        
        return new TransitionDatabase(db);
    }
}

export = TransitionDatabaseFactory;