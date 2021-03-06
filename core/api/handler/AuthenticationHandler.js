"use strict";
var imports = {
		_            : require("underscore"),
		Passport     : require("passport"),
		PassportLocal: require("passport-local"),
		User         : require("../model/User"),
		Messages    : require("../enum/Messages"),
		ErrorFactory: require("../factory/ErrorFactory")
	},
	privates = {
		LocalStrategy: imports.PassportLocal.Strategy
	};

/**
 * Handles Authentication :O
 * @class core.api.handler.AuthenticationHandler
 * @author Erwin
 * @date 14/10/2014
 * @constructor
 */
var AuthenticationHandler = function () {
	return this;
};

/**
 * Initialise authentication
 * @param app The Express application on which to authenticate
 */
AuthenticationHandler.prototype.init = function (app) {
	var me = this;

	me.setupStrategies();

	app.use(imports.Passport.initialize());
	app.use(imports.Passport.session());

	me.setupSerializers();
};

/**
 * Sets up the used strategies
 */
AuthenticationHandler.prototype.setupStrategies = function () {
	var me = this;

	//Local Strategy
	imports.Passport.use(new privates.LocalStrategy(me.localStrategy));
};

/**
 * Sets up the used (de-)serializer(s)
 */
AuthenticationHandler.prototype.setupSerializers = function () {
	imports.Passport.serializeUser(function (user, done) {
		done(null, user.getId());
	});

	imports.Passport.deserializeUser(function (id, done) {
		imports.User.prototype.find({ _id: id }, function (err, user) {
			if (!err && user.length !== 1) {
				err = imports.ErrorFactory.create(imports.Messages.UNKNOWN_USER);
			}
			else {
				user = user[0];
			}

			return done(err, user);
		});
	});
};

/**
 * Local strategy will check for a username and see if the passwords match
 * @param username
 * @param password
 * @param done
 */
AuthenticationHandler.prototype.localStrategy = function (username, password, done) {
	imports.User.prototype.find({ username: username }, function (err, users) {
		if (err) {
			return done(err);
		}

		if (!users || users.length !== 1) {
			return done(null, false, { message: imports.Messages.UNKNOWN_USER });
		}

		var lUser = users[0];
		lUser.isValidPassword(function (err, result) {
			if (err) {
				return done(err);
			}

			if (!result) {
				return done(null, false, { message: imports.Messages.INVALID_PASSWORD });
			}

			return done(null, lUser);
		});
	});
}
;

module.exports = new AuthenticationHandler();