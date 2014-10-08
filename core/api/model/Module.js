"use strict";
/**
 * Represents a module
 * @class Module
 * @author Erwin
 * @date 8/10/2014
 */

var imports = {
		_: require("underscore")
	},
	privates = {
		model: {
			id       : { type: Number, default: null, validate: ["number"] },
			name     : { type: String, default: "", validate: ["required", "alphabetic"] },
			rootPath : { type: String, default: "", validate: ["required", "alphanumeric"] },
			apiPath  : { type: String, default: "", validate: ["alphanumeric"] },
			publicDir: { type: String, default: "/app", validate: ["alphanumeric"] }
		}
	};

/**
 * @constructor
 */
var Module = function (conf) {
	var me = this,
		lKey;

	//Set defaults
	for (lKey in privates.model) {
		if (privates.model.hasOwnProperty(lKey)) {
			me[lKey] = privates.model[lKey].default;
		}
	}

	//Apply config
	for (lKey in conf) {
		if (conf.hasOwnProperty(lKey)) {
			if (!privates.model.hasOwnProperty(lKey)) {
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

/**
 * Find all modules by a query, an empty query will return all modules
 * @param [query]
 * @returns {Array}
 */
Module.prototype.find = function (query) {
	var lModules = [
		{
			name       : "Core",
			version    : "0.1",
			rootPath   : "/core",
			apiPath    : "/",
			"publicDir": "/app"
		}/*,
		 {
		 name       : "Scheduler",
		 version    : "0.1",
		 rootPath   : "/scheduler",
		 "publicDir": "/app"
		 }*/
	];

	query = query || {};

	return imports._.where(lModules, query);
};

module.exports = Module;