'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

module.exports = Foxx.Model.extend({
    schema: {
    	username: joi.string().required(),
    	password: joi.string().required(),
    	role: joi.number().integer()
  }
});

