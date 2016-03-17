'use strict';
var _ = require('underscore');
var joi = require('joi');
var db = require("internal").db;

var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var controller = new Foxx.Controller(applicationContext);

var auth = applicationContext.dependencies.auth;
var sessionStorage = applicationContext.dependencies.sessions.sessionStorage;
var users = applicationContext.dependencies.users;

var createUser = require('../util/auth').createUser;
var login = require('../util/auth').login;
var logout = require('../util/auth').logout;

var ingredients = require('../models/ingredients');
var recipes = require('../models/recipes');
var edges = require('../models/edges');
var credentials = require('../models/credentials');

var ingredientsRepo = require('../repositories/ingredients');
var recipesRepo = require('../repositories/recipes');
var edgesRepo = require('../repositories/edges');

var ingredientsRepo = new ingredientsRepo(
    applicationContext.collection('ingredients'), { model: ingredients }
);
var recipesRepo = new recipesRepo(
    applicationContext.collection('recipes'), { model: recipes }
);
var edgesRepo = new edgesRepo(
    applicationContext.collection('edges'), { model: edges }
);

var ingredientsIdSchema = joi.string().required()
    .description('The id of the ingredients')
    .meta({ allowMultiple: false });
var recipesIdSchema = joi.string().required()
    .description('The id of the recipes')
    .meta({ allowMultiple: false });
var edgesIdSchema = joi.string().required()
    .description('The id of the edges')
    .meta({ allowMultiple: false });


/* Activate sessions for this controller.
 *
 *  
 * Once sessions have been activated, a session property will be added to the request object passed to route handlers defined on the controller, which will be a saved instance of the session model provided by the session storage. 
 * 
 * If the option autoCreateSession has not explicitly been set to false, a new session will be created for users that do not yet have an active session. 
 * 
 * If cookie sessions are used, the session cookie will be updated after every route. 
 * 
 */
controller.activateSessions({
    sessionStorage: sessionStorage,
    cookie: { secret: 'Secret text to use during development. Replace with a unique random string when deploy to production.' }
});


/** Create user.
 *
 * Create a new user.
 *
 */
controller.post('/register', function (req, res) {
    var creds = req.params('credentials');
    var user = createUser(creds);

    res.status(201);
    res.json({Welcome: user.attributes.user});
}).bodyParam('credentials', { description: 'Username and Password', type: credentials });


/** Log in route.
 *
 * Create a session for an existing user.
 *
 */
controller.post('/login', function (req, res) {
        var credentials = req.params('credentials');
        var errorstatus = new String();
        var logininfo = login(credentials, req.session, errorstatus);

        if (logininfo.errorstat == 0) {
            res.status(201);
            res.json({ msg: 'Welcome ' + logininfo.usr.attributes.user });
        } else {
            res.status(401);
            res.json({ msg: 'Something went wrong. You are not logged in.' });
            console.log("\n", "User: ", logininfo.usr.attributes.user, "\n");
        };
    })
    .bodyParam('credentials', { description: 'Username and Password', type: credentials })


/** Log out route.
 *
 * Destroy user's session.
 *
 */
controller.destroySession('/logout', function (req, res) {
    req.session.delete;
    res.json({ msg: 'Bye Bye.' });
})

/** Recipe name search.
 *
 * Looks for recipes whose RecipeName property contains the URL's "content" string
 * and returns their connected ingredients and some simple recipe stats.
 */
controller.get('/recipes-ingredients/:content', function (req, res) {
        var searchString = req.urlParameters.content;
        //console.log("\n", "session: ", req.session, "\n");
        var results = db._query(aqlQuery `
        FOR r IN ${recipesRepo.collection}
        FILTER LIKE(r.RecipeName, CONCAT("%",${searchString},"%"), true)
        LET connections = (
            FOR v, e, p IN 1..1 ANY r ${edgesRepo.collection}
            SORT v.ItemName ASC
            RETURN v)
        RETURN {"Recipe": r.RecipeName, "PLU": r.PLU, "IngredientCount": COUNT(connections), "Ingredients": connections[*].ItemName}
        `).toArray();
        res.json(results);
    })
    .pathParam('content', {
        description: "The string to search for",
        type: joi.string()
    }).onlyIfAuthenticated();

/** Recipe name search to return results in graph format.
 *
 * Looks for recipes whose name property contains the URL's "content" string
 * and returns their connected ingredients and some stats.
 */
controller.get('/recipes-ingredients-graph/:content', function (req, res) {
        var searchString = req.urlParameters.content;
        console.log("\n", "Foxx object: ", Foxx, "\n");
        var results = db._query(aqlQuery `
        FOR r IN ${recipesRepo.collection}
        FILTER LIKE(r.RecipeName, CONCAT("%",${searchString},"%"), true)
        LET connections = (
            FOR v, e, p IN 1..1 ANY r ${edgesRepo.collection}
            SORT v.ItemName ASC
            RETURN v)
        RETURN {"Recipe: ": r.RecipeName, "PLU: ": r.PLU, "IngredientCount: ": COUNT(connections), "Ingredients: ": connections[*].ItemName}
        `).toArray();
        res.json(results)
    })
    .pathParam('content', {
        description: "The string to search for",
        type: joi.string()
    });
