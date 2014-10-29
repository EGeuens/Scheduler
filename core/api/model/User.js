"use strict";
/**
 * Represents a user (a real one!)
 * @class core.api.model.User
 * @author Erwin
 * @date 17/09/2014
 */

var imports = {
		_              : require("underscore"),
		ModelFactory   : require("../factory/ModelFactory"),
		ErrorFactory: require("../factory/ErrorFactory"),
		Validator      : require("../util/Validator"),
		PasswordHash   : require("password-hash"),
		DatabaseAdapter: require("../adapter/DatabaseAdapter")
	},
	privates = {
		dbType    : imports.DatabaseAdapter.MONGODB,
		collection: "users",
		model     : {
			_id     : { type: Number, default: null, validate: ["number"] },
			name     : { type: String, default: "", validate: ["required", "alphabetic"] },
			firstName: { type: String, default: "", validate: ["required", "alphabetic"] },
			username : { type: String, default: "", validate: ["required", "alphanumeric"] },
			password: { type: String, default: "", validate: [] },
			email    : { type: String, default: "", validate: ["required", "email"] }
		}
	};

/**
 * @constructor
 */
var User = imports.ModelFactory.create(privates.model);

////
// Public methods
///
/**
 * Updates or creates a user
 * @param context
 * @param cb
 */
User.prototype.save = function (context, cb) {
	var me = this,
		lUser = new User(context.getQuery());

	if (!lUser.validate()) {
		return cb(null, { message: "Invalid user" }, 412);
	}

	imports.DatabaseAdapter.save(privates.dbType, privates.collection, lUser.toModel(), function (err, saved) {
		var lUser = null;

		if (!err && saved) {
			lUser = new User(saved);
		}

		cb(err, lUser);
	});
};

/**
 * Find one or multiple user(s)
 * @param query
 * @param cb
 */
User.prototype.find = function (query, cb) {
	imports.DatabaseAdapter.query(privates.dbType, privates.collection, { selector: query }, function (err, users) {
		var lUsers = null,
			lUser, i;

		if (!err) {
			if (imports._.isObject(users) && !imports._.isArray(users)) {
				lUsers = [new User(users)];
			}
			else {
				lUsers = [];
				for (i = 0; i < users.length; i++) {
					lUser = new User(users[i]);
					lUsers.push(lUser);
				}
			}
		}

		cb(err, lUsers);
	});
};

User.prototype.isValidPassword = function (cb) {
	var me = this,
		lSelector = me.toModel();

	delete lSelector.password;

	User.prototype.find(lSelector, function (err, result) {
		if (err) {
			return cb(err, false);
		}

		if (!imports._.isArray(result) || result.length !== 1) {
			return cb(null, false);
		}

		var lUser = result[0];
		cb(null, me.getPassword() === lUser.getPassword());
	});
};

////
// Getters/Setters
///
User.prototype.getModelDefinition = function () {
	return privates.model;
};

User.prototype.getId = function () {
	return this._id;
};

User.prototype.setId = function (_id) {
	this._id = _id;
};

User.prototype.getName = function () {
	return this.name;
};

User.prototype.setName = function (name) {
	this.name = name;
};

User.prototype.getUsername = function () {
	return this.username;
};

User.prototype.setUsername = function (username) {
	this.username = username;
};

User.prototype.getEmail = function () {
	return this.email;
};

User.prototype.setEmail = function (email) {
	this.email = email;
};

User.prototype.getFirstName = function () {
	return this.firstName;
};

User.prototype.setFirstName = function (firstName) {
	this.firstName = firstName;
};

User.prototype.getPassword = function () {
	return this.password;
};

/**
 * Sets the password as a hash(!)
 * @param password
 */
User.prototype.setPassword = function (password) {
	if (!imports.PasswordHash.isHashed(password)) {
		password = imports.PasswordHash.generate(password);
	}

	this.password = password;
};

module.exports = User;