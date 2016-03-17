'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

module.exports = Foxx.Model.extend({
    schema: {
        // Describe the attributes with joi here
        _key: joi.string().required(),
        _from: joi.string().required(),
        _to: joi.string().required(),
        label: joi.string()
    }
});
