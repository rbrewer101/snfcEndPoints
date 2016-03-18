'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var ingredientsRepo = require('../repositories/ingredients');
var ingredients = require('../models/ingredients');
var controller = new Foxx.Controller(applicationContext);

var ingredientsIdSchema = joi.string().required()
    .description('The id of the ingredients')
    .meta({ allowMultiple: false });

var ingredientsRepo = new ingredientsRepo(
    applicationContext.collection('ingredients'), { model: ingredients }
);

/** Lists of all ingredients.
 *
 * This function simply returns the list of all ingredients.
 */
controller.get('/', function (req, res) {
    res.json(_.map(ingredientsRepo.all(), function (model) {
        return model.forClient();
    }));
});

/** Creates a new ingredients.
 *
 * Creates a new ingredients. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
        var ingredients = req.parameters.ingredients;
        res.json(ingredientsRepo.save(ingredients).forClient());
    })
    .bodyParam('ingredients', {
        description: 'The ingredients you want to create',
        type: ingredients
    });

/** Reads a ingredients.
 *
 * Reads a ingredients.
 */
controller.get('/:id', function (req, res) {
        var id = req.urlParameters.id;
        res.json(ingredientsRepo.byId(id).forClient());
    })
    .pathParam('id', ingredientsIdSchema)
    .errorResponse(ArangoError, 404, 'The ingredients could not be found');

/** Search.
 *
 * Searches for string in ItemName property.
 */
controller.get('/search/:content', function (req, res) {
        console.log(applicationContext.collectionName("ingredients"));
        var searchString = req.urlParameters.content;
        res.json(_.map(ingredientsRepo.like(searchString), function (h) {
            return h.forClient();
        }))
    })
    .pathParam('content', {
        description: "The string to search for",
        type: joi.string()
    });

/** Replaces a ingredients.
 *
 * Changes a ingredients. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
        var id = req.urlParameters.id;
        var ingredients = req.parameters.ingredients;
        res.json(ingredientsRepo.replaceById(id, ingredients));
    })
    .pathParam('id', ingredientsIdSchema)
    .bodyParam('ingredients', {
        description: 'The ingredients you want your old one to be replaced with',
        type: ingredients
    })
    .errorResponse(ArangoError, 404, 'The ingredients could not be found');

/** Updates a ingredients.
 *
 * Changes a ingredients. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
        var id = req.urlParameters.id;
        var patchData = req.parameters.patch;
        res.json(ingredientsRepo.updateById(id, patchData));
    })
    .pathParam('id', ingredientsIdSchema)
    .bodyParam('patch', {
        description: 'The patch data you want your ingredients to be updated with',
        type: joi.object().required()
    })
    .errorResponse(ArangoError, 404, 'The ingredients could not be found');

/** Removes a ingredients.
 *
 * Removes a ingredients.
 */
controller.delete('/:id', function (req, res) {
        var id = req.urlParameters.id;
        ingredientsRepo.removeById(id);
        res.json({ success: true });
    })
    .pathParam('id', ingredientsIdSchema)
    .errorResponse(ArangoError, 404, 'The ingredients could not be found');
