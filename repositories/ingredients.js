'use strict';
var Foxx = require('org/arangodb/foxx'),
    _ = require("underscore"),
    db = require("internal").db;

module.exports = Foxx.Repository.extend({
    // Add your custom methods here

    like: function (content) {
        var query = "FOR h in @@col filter like(h.ItemName, @str, true) return h";
        return _.map(db._query(query, {
            "@col": this.collection.name(),
            str: "%" + content + "%"
        }).toArray(), function (rawstring) {
            var somestring = new this.model(rawstring);
            return somestring;
        }, this);
    }
});
