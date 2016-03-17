'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');

module.exports = Foxx.Model.extend({
    schema: {
        // Describe the attributes with joi here
        _key: joi.string().required(),
		'NumPortions': joi.number().integer(),
		'PrepTime': joi.string(),
		'YieldQty': joi.number(),
		'YieldUnitID': joi.number().integer(),
		'PortionQty': joi.number(),
		'PortionPrice': joi.number().precision(2),
		'Notes': joi.string(),
		'Servings': joi.string(),
		'PLU': joi.string(),
		'IsMenu': joi.binary(),
		'RecipeID': joi.number().integer(),
		'RecipeName': joi.string()
    }
});
