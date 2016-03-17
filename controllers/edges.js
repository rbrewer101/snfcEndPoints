'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var edgesRepo = require('../repositories/edges');
var edges = require('../models/edges');
var controller = new Foxx.Controller(applicationContext);

var edgesIdSchema = joi.string().required()
    .description('The id of the edges')
    .meta({ allowMultiple: false });

var edgesRepo = new edgesRepo(
    applicationContext.collection('edges'), { model: edges }
);

/** Lists of all edges.
 *
 * This function simply returns the list of all edges.
 */
controller.get('/', function (req, res) {
    res.json(_.map(edgesRepo.all(), function (model) {
        return model.forClient();
    }));
});

/** Creates a new edges.
 *
 * Creates a new edges. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
        var edges = req.parameters.edges;
        res.json(edgesRepo.save(edges).forClient());
    })
    .bodyParam('edges', {
        description: 'The edges you want to create',
        type: edges
    });

/** Reads a edges.
 *
 * Reads a edges.
 */
controller.get('/:id', function (req, res) {
        var id = req.urlParameters.id;
        res.json(edgesRepo.byId(id).forClient());
    })
    .pathParam('id', edgesIdSchema)
    .errorResponse(ArangoError, 404, 'The edges could not be found');

/** Search.
 *
 * Searches for string in RecipeName property.
 */
controller.get('/search/:content', function (req, res) {
        console.log(applicationContext.collectionName("edges"));
        var searchString = req.urlParameters.content;
        res.json(_.map(edgesRepo.like(searchString), function (h) {
            return h.forClient();
        }))
    })
    .pathParam('content', {
        description: "The string to search for",
        type: joi.string()
    });

/** Replaces a edges.
 *
 * Changes a edges. The information has to be in the
 * requestBody.
 */
controller.put('/:id', function (req, res) {
        var id = req.urlParameters.id;
        var edges = req.parameters.edges;
        res.json(edgesRepo.replaceById(id, edges));
    })
    .pathParam('id', edgesIdSchema)
    .bodyParam('edges', {
        description: 'The edges you want your old one to be replaced with',
        type: edges
    })
    .errorResponse(ArangoError, 404, 'The edges could not be found');

/** Updates a edges.
 *
 * Changes a edges. The information has to be in the
 * requestBody.
 */
controller.patch('/:id', function (req, res) {
        var id = req.urlParameters.id;
        var patchData = req.parameters.patch;
        res.json(edgesRepo.updateById(id, patchData));
    })
    .pathParam('id', edgesIdSchema)
    .bodyParam('patch', {
        description: 'The patch data you want your edges to be updated with',
        type: joi.object().required()
    })
    .errorResponse(ArangoError, 404, 'The edges could not be found');

/** Removes a edges.
 *
 * Removes a edges.
 */
controller.delete('/:id', function (req, res) {
        var id = req.urlParameters.id;
        edgesRepo.removeById(id);
        res.json({ success: true });
    })
    .pathParam('id', edgesIdSchema)
    .errorResponse(ArangoError, 404, 'The edges could not be found');
