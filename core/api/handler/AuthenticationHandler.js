"use strict";
/**
 * Handles Authentication :O
 * @class core.api.handler.AuthenticationHandler
 * @author Erwin
 * @date 14/10/2014
 */

var imports = {
		_            : require("underscore"),
		Passport     : require("passport"),
		PassportLocal: require("passport-local"),
		User         : require("../model/User"),
		Messages     : require("../enum/Messages")
	},
	privates = {
		LocalStrategy: imports.PassportLocal.Strategy
	};
/**
 * @constructor
 */
var AuthenticationHandler = function () {
	return this;
};

AuthenticationHandler.prototype.init = function (app) {
	var me = this;

	me.setupStrategies();

	app.use(imports.Passport.initialize());
	app.use(imports.Passport.session());

	me.setupSerializers();
};

AuthenticationHandler.prototype.setupStrategies = function () {
	var me = this;

	//Local Strategy
	imports.Passport.use(new privates.LocalStrategy(me.localStrategy));
};

AuthenticationHandler.prototype.setupSerializers = function () {
	imports.Passport.serializeUser(function (user, done) {
		done(null, user.getId());
	});

	imports.Passport.deserializeUser(function (id, done) {
		imports.User.prototype.find({ _id: id }, function (err, user) {
			return done(err, user);
		});
	});
};

AuthenticationHandler.prototype.localStrategy = function (username, password, done) {
	imports.User.prototype.find({ username: username }, function (err, user) {
		if (err) {
			return done(err);
		}

		if (!user || imports._.isArray(user)) {
			return done(null, false, { message: imports.Messages.UNKNOWN_USER });
		}

		user.isValidPassword(function (err, result) {
			if (err) {
				return done(err);
			}

			if (!result) {
				return done(null, false, { message: imports.Messages.INVALID_PASSWORD });
			}

			return done(null, user);
		});
	});
}
;

module.exports = new AuthenticationHandler();