"use strict";
/**
 * Represents a user (a real one!)
 * @class core.api.model.User
 * @author Erwin
 * @date 17/09/2014
 */

var imports = {
		ModelFactory: require("../factory/ModelFactory")
	},
	privates = {
		model: {
			_id: { type: Number, default: null, validate: ["number"] },
			name     : { type: String, default: "", validate: ["required", "alphabetic"] },
			firstName: { type: String, default: "", validate: ["required", "alphabetic"] },
			username : { type: String, default: "", validate: ["required", "alphanumeric"] },
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
User.prototype.find = function () {
	//TODO think this through further
	var me = this;
	me.setId(123);
	me.setName("tester");
	me.setFirstName("tester");
	me.setUsername("tester123");
	me.setEmail("tester@test.com");
	return me;
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

module.exports = User;