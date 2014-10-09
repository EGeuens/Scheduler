"use strict";
/**
 * Represents a module
 * @class Module
 * @author Erwin
 * @date 8/10/2014
 */

var imports = {
		_           : require("underscore"),
		ModelFactory: require("../factory/ModelFactory")
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
var Module = imports.ModelFactory.create(privates.model);

/**
 * Find all modules by a query, an empty query will return all modules
 * TODO dynamically load modules (MongoDB)
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