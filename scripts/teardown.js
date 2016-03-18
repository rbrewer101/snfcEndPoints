'use strict';
var db = require("org/arangodb").db;

function dropCollection(name) {
  var collectionName = applicationContext.collectionName(name);
  db._drop(collectionName);
}


/* Uncomment these collection methods to enable collection
 removal upon app teardown.
dropCollection("ingredients");
dropCollection("recipes");
dropCollection("edges");
dropCollection("credentials");
*/