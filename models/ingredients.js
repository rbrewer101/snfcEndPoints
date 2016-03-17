'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

module.exports = Foxx.Model.extend({
    schema: {
        // Describe the attributes with joi here
        _key: joi.string().required(),
        'name': joi.string(),
        'ItemID': joi.number().integer(),
        'ProfCentID': joi.number().integer(),
        'ItemName': joi.string()
    }
});
