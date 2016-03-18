'use strict';
var _ = require('underscore');
var Foxx = require('org/arangodb/foxx');
var auth = applicationContext.dependencies.auth;
var users = applicationContext.dependencies.users;
//var sessions = applicationContext.dependencies.sessions;
//var sessionStorage = applicationContext.dependencies.sessions.sessionStorage;
//var NotLoggedIn = require('./not_logged_in').NotLoggedIn;

function createUser(credentials) {
    var password = auth.hashPassword(credentials.get('password'));
    return users.create(credentials.get('username'), { simple: password });
}


function login(credentials, reqsession, errorstatus) {
	// Get username from users collection.
    var user = users.resolve(credentials.get('username'));
    console.log("\n", "user.get('authData').simple: ", user.get('authData').simple, "\n");

    // Verify that session password matches user's stored password.
    var valid = auth.verifyPassword(
        user ? user.get('userData').simple : {},
        credentials.get('password'));
    try {
        if (!valid) {
            throw "Invalid credentials.";
        }
        if (valid) {
            reqsession.get('sessionData').username = user.get('user');
            reqsession.setUser(user);
            reqsession.save();
            var errorstatus = 0;
        }
    } catch (err) {
        var errorstatus = 1;
        console.log(err, " Errorstatus set to 1. No session saved.");
    } finally {
        return {
            usr: user,
            errorstat: errorstatus
        };
    }

}

function logout(reqsession, errorstatus) {
    reqsession.delete;
    return errorstatus;
}

exports.logout = logout;
exports.login = login;
exports.createUser = createUser;
