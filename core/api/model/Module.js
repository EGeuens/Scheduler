"use strict";
/**
 * Represents a module
 * @class Module
 * @author Erwin
 * @date 8/10/2014
 */

var imports = {
		_              : require("underscore"),
		Q              : require("q"),
		ModelFactory   : require("../factory/ModelFactory"),
		DatabaseAdapter: require("../adapter/DatabaseAdapter")
	},
	privates = {
		dbType    : imports.DatabaseAdapter.MONGODB,
		collection: "modules",
		model     : {
			_id       : { type: Number, default: null, validate: ["number"] },
			name      : { type: String, default: "", validate: ["required", "alphabetic"] },
			version   : { type: String, default: "", validate: ["alphanumeric"] },
			rootPath  : { type: String, default: "", validate: ["required", "alphanumeric"] },
			apiPath   : { type: String, default: "", validate: ["alphanumeric"] },
			publicPath: { type: String, default: "", validate: ["alphanumeric"] },
			publicDir : { type: String, default: "/app", validate: ["alphanumeric"] }
		}
	};

/**
 * @constructor
 */
var Module = imports.ModelFactory.create(privates.model);

////
// Public methods
////
/**
 * Find all modules by a query, an empty query will return all modules
 * @param query
 * @param cb
 * @returns {Array}
 */
Module.prototype.find = function (query, cb) {
	query = query || {};

	if (!query.selector) {
		query.selector = {};

		//is it called as a static function?
		if (this) {
			query.selector = this.toModel();
		}
	}

	if (!query.options) {
		query.options = {};
	}

	imports.DatabaseAdapter.query(privates.dbType, privates.collection, query, function (err, modules) {
		var lModules = null,
			lModule, i;

		if (!err) {
			lModules = [];
			for (i = 0; i < modules.length; i++) {
				lModule = modules[i];
				lModules.push(new Module(lModule));
			}
		}

		cb(err, lModules);
	});
};

Module.prototype.save = function (cb) {
	var me = this;

	imports.DatabaseAdapter.save(privates.dbType, privates.collection, me.toModel(), function (err, saved) {
		var lModule = null;

		if (!err && saved) {
			lModule = new Module(saved);
		}

		cb(err, lModule);
	});
};

////
// Getters/setters
////
Module.prototype.getModelDefinition = function () {
	return privates.model;
};

Module.prototype.getId = function () {
	return this._id;
};

Module.prototype.setId = function (id) {
	return this._id = id;
};

Module.prototype.getVersion = function () {
	return this.version;
};

Module.prototype.setVersion = function (version) {
	return this.version = version;
};

Module.prototype.getName = function () {
	return this.name;
};

Module.prototype.setName = function (name) {
	return this.name = name;
};

Module.prototype.getRootPath = function () {
	return this.rootPath;
};

Module.prototype.setRootPath = function (rootPath) {
	return this.rootPath = rootPath;
};

Module.prototype.getApiPath = function () {
	return this.apiPath;
};

Module.prototype.setApiPath = function (apiPath) {
	return this.apiPath = apiPath;
};

Module.prototype.getPublicPath = function () {
	return this.publicPath;
};

Module.prototype.setPublicPath = function (publicPath) {
	return this.publicPath = publicPath;
};

Module.prototype.getPublicDir = function () {
	return this.publicDir;
};

Module.prototype.setPublicDir = function (publicDir) {
	return this.publicDir = publicDir;
};

module.exports = Module;