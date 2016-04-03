import IEmissionDatabase = require("../InMemoryDatabase/IEmissionDatabase");
import EmissionDatabase = require("../InMemoryDatabase/EmissionDatabase");
import EmissionCounter = require("../Counters/EmissionCounter");
import Loki = require("lokijs");

module EmissionDatabaseFactory {
    export var create = (databaseName: string): IEmissionDatabase => {
        var db = new Loki(`${databaseName}.json`);
        db.addCollection<EmissionCounter>("emission").ensureUniqueIndex("id");
        
        return new EmissionDatabase(db);
    }
}

export = EmissionDatabaseFactory;