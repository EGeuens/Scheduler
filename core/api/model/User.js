"use strict";
/**
 * Represents a user (a real one!)
 * @class core.api.model.User
 * @author Erwin
 * @date 17/09/2014
 */

var imports = {
		Logger      : require("../util/Logger"),
		Messages    : require("../enum/Messages"),
		ErrorFactory: require("../factory/ErrorFactory")
	},
	privates = {
		defaults: {
			id       : null,
			name     : "",
			firstName: "",
			username : "",
			email    : ""
		}
	};

/**
 * @constructor
 */
var User = function (conf) {
	var me = this,
		lKey;

	//Set defaults
	for (lKey in privates.defaults) {
		if (privates.defaults.hasOwnProperty(lKey)) {
			me[lKey] = privates.defaults[lKey];
		}
	}

	//Apply config
	for (lKey in conf) {
		if (conf.hasOwnProperty(lKey)) {
			if (!privates.defaults.hasOwnProperty(lKey)) {
				imports.Logger.warn(imports.Messages.TRYING_TO_SET_INVALID_PROPERTY, lKey);
				continue;
			}

			var lCapitalizedKey = lKey.charAt(0).toUpperCase() + lKey.substr(1),
				lSetter = ["set", lCapitalizedKey].join("");

			if (!me[lSetter]) {
				throw imports.ErrorFactory.create(imports.Messages.NO_SETTER_FOUND_FOR, lKey);
			}

			me[lSetter](conf[lKey]);
		}
	}

	return this;
};

User.prototype.getId = function () {
	return this.id;
};

User.prototype.setId = function (id) {
	return this.id = id;
};

User.prototype.getName = function () {
	return this.name;
};

User.prototype.setName = function (name) {
	return this.name = name;
};

User.prototype.getUsername = function () {
	return this.username;
};

User.prototype.setUsername = function (username) {
	return this.username = username;
};

User.prototype.getEmail = function () {
	return this.email;
};

User.prototype.setEmail = function (email) {
	return this.email = email;
};

User.prototype.getFirstName = function () {
	return this.firstName;
};

User.prototype.setFirstName = function (firstName) {
	return this.firstName = firstName;
};

module.exports = User;