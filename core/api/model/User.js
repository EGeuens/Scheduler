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
User.prototype.find = function (query, cb) {
	imports.DatabaseAdapter.query(privates.dbType, privates.collection, { selector: query }, function (err, users) {
		var lReturn = null,
			lUser, i;

		if (!err) {
			if (imports._.isUndefined(users.length)) {
				lReturn = new User(users);
				cb(err, lReturn);
				return;
			}

			lReturn = [];
			for (i = 0; i < users.length; i++) {
				lUser = new User(users[i]);
				lReturn.push(lUser);
			}
		}

		cb(err, lReturn);
	});
};

User.prototype.isValidPassword = function (cb) {
	var me = this;

	User.prototype.find({
		selector: me.toModel()
	}, function (err, result) {
		if (err) {
			return cb(err, false);
		}

		cb(null, me.getPassword() === result.getPassword());
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