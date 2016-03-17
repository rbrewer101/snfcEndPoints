'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var recipesRepo = require('../repositories/recipes');
var recipes = require('../models/recipes');
var controller = new Foxx.Controller(applicationContext);

var recipesIdSchema = joi.string().required()
    .description('The id of the recipes')
    .meta({ allowMultiple: false });

var recipesRepo = new recipesRepo(
    applicationContext.collection('recipes'), { model: recipes }
);

/** Lists of all recipes.
 *
 * This function simply returns the list of all recipes.
 */
controller.get('/', function (req, res) {
    res.json(_.map(recipesRepo.all(), function (model) {
        return model.forClient();
    }));
});

/** Creates a new recipes.
 *
 * Creates a new recipes. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
        var recipes = req.parameters.recipes;
        res.json(recipesRepo.save(recipes).forClient());
    })
    .bodyParam('recipes', {
        description: 'The recipes you want to create',
        type: recipes
    });

/** Reads a recipes.
 *
 * Reads a recipes.
 */
controller.get('/:id', function (req, res) {
        var id = req.urlParameters.id;
        res.json(recipesRepo.byId(id).forClient());
    })
    .pathParam('id', recipesIdSchema)
    .errorResponse(ArangoError, 404, 'The recipes could not be found');

/** Search.
 *
 * Searches for string in RecipeName property.
 */
controller.get('/search/:content', function (req, res) {
        console.log(applicationContext.collectionName("recipes"));
        var searchString = req.urlParameters.content;
        res.json(_.map(recipesRepo.like(searchString), function (h) {
            return h.forClient();
        }))
    })
    .pathParam('content', {
        description: "The string to search for",
        type: joi.string()
    });

/** Replaces a recipes.
 *
 * Changes a recipes. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
        var id = req.urlParameters.id;
        var recipes = req.parameters.recipes;
        res.json(recipesRepo.replaceById(id, recipes));
    })
    .pathParam('id', recipesIdSchema)
    .bodyParam('recipes', {
        description: 'The recipes you want your old one to be replaced with',
        type: recipes
    })
    .errorResponse(ArangoError, 404, 'The recipes could not be found');

/** Updates a recipes.
 *
 * Changes a recipes. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
        var id = req.urlParameters.id;
        var patchData = req.parameters.patch;
        res.json(recipesRepo.updateById(id, patchData));
    })
    .pathParam('id', recipesIdSchema)
    .bodyParam('patch', {
        description: 'The patch data you want your recipes to be updated with',
        type: joi.object().required()
    })
    .errorResponse(ArangoError, 404, 'The recipes could not be found');

/** Removes a recipes.
 *
 * Removes a recipes.
 */
controller.delete('/:id', function (req, res) {
        var id = req.urlParameters.id;
        recipesRepo.removeById(id);
        res.json({ success: true });
    })
    .pathParam('id', recipesIdSchema)
    .errorResponse(ArangoError, 404, 'The recipes could not be found');
