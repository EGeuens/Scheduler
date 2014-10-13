"use strict";
/**
 * Abstracts database connection, querying, ...
 * @class core.api.adapter.DatabaseAdapter
 * @author Erwin
 * @date 9/10/2014
 */

var imports = {
		ErrorFactory  : require("../factory/ErrorFactory"),
		MongoDbAdaptee: require("../adaptee/MongoDbAdaptee")
	},
	privates = {
		supported: {
			mongodb: imports.MongoDbAdaptee
		},

		callAdaptee: function (method, type, collection, query, cb) {
			if (privates.supported.hasOwnProperty(type)) {
				privates.supported[type][method](collection, query, cb);
			}
			else {
				cb(imports.ErrorFactory.create("Database type is not supported!"));
			}
		}
	};
/**
 * @constructor
 */
var DatabaseAdapter = function () {
	return this;
};

////
// Public properties
////
DatabaseAdapter.prototype.MONGODB = "mongodb";

////
// Public methods
////
/**
 * Query the database
 * @param type Type of the database
 * @param collection Collection/table on the database
 * @param query The query
 * @param cb
 */
DatabaseAdapter.prototype.query = function (type, collection, query, cb) {
	privates.callAdaptee("query", type, collection, query, cb);
};

/**
 * Insert or update a record in the database
 * @param type Type of the database
 * @param collection Collection/table on the database
 * @param rec The record
 * @param cb
 */
DatabaseAdapter.prototype.save = function (type, collection, rec, cb) {
	privates.callAdaptee("save", type, collection, rec, cb);
};

module.exports = new DatabaseAdapter();