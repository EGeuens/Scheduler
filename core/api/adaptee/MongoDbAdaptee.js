"use strict";
/**
 *
 * @class core.api.adaptee.MongoDbAdaptee
 * @author Erwin
 * @date 9/10/2014
 */

var imports = {
		_           : require("underscore"),
		ErrorFactory: require("../factory/ErrorFactory"),
		Logger      : require("../util/Logger"),
		Config      : require("../Config"),
		mongodb     : require("mongodb")
	},
	privates = {
		uniqueIdPrefix: "Query.MongoDB."
	};

/**
 * @constructor
 */
var MongoDbAdaptee = function () {
	return this;
};

////
// Public methods
////
/**
 * Open the MongoDB database
 * @param cb
 */
MongoDbAdaptee.prototype.openDb = function (cb) {
	var me = this,
		lMongoConfig = imports.Config.mongodb,
		lMongoServerConfig = lMongoConfig.server;

	if (!me.db) {
		imports.Logger.debug("Opening MongoDB");
		me.db = imports.mongodb.Db(lMongoConfig.db, new imports.mongodb.Server(lMongoServerConfig.host, lMongoServerConfig.port, lMongoServerConfig.options), lMongoConfig.options);
		me.db.open(function (err, db) {
			try {
				imports.Logger.debug("MongoDB is open for business!");
				me.db.on("close", function () {
					me.db = null;
				});

				cb(err, db);
			}
			catch (e) {
				cb(imports.ErrorFactory.create(e.message, "\n", e.stack));
			}
		});
	}
	else {
		cb(null, me.db);
	}
};

/**
 * Query the MongoDB database
 * @param collection
 * @param query
 * @param cb
 */
MongoDbAdaptee.prototype.query = function (collection, query, cb) {
	var me = this;

	me.openDb(function (err, db) {
		if (err) {
			return cb(err);
		}

		query.id = imports._.uniqueId(privates.uniqueIdPrefix);

		if (!query.selector) {
			query.selector = {};
		}

		if (!query.fields) {
			query.fields = {};
		}

		if (!query.options) {
			query.options = {};
		}

		if (query.selector.hasOwnProperty("_id")) {
			query.selector._id = imports.mongodb.ObjectID(query.selector._id.toString());
		}

		var lCollection = db.collection(collection);
		imports.Logger.debug("Gonna do a QUERY [MongoDB] on collection:", collection, "\nGenerated id:", query.id, "\nHere's the selector:\n", query.selector);
		lCollection.find(query.selector, query.fields, query.options).toArray(function (err, result) {
			imports.Logger.debug("Query", query.id, "returned!", result);
			cb(err, result);
		});
	});
};

/**
 * Save a record
 * @param collection
 * @param record
 * @param cb
 */
MongoDbAdaptee.prototype.save = function (collection, record, cb) {
	var me = this;

	me.openDb(function (err, db) {
		if (err) {
			return cb(err);
		}

		var query = { id: imports._.uniqueId(privates.uniqueIdPrefix), record: record };

		var lCollection = db.collection(collection);
		imports.Logger.debug("Gonna do a SAVE [MongoDB] on collection:", collection, "\nGenerated id:", query.id, "\nHere's the record:\n", query.record);
		lCollection.save(query.record, function (err, saved) {
			imports.Logger.debug("Query", query.id, "returned!", saved);
			var lReturn = null;

			if (!err) {
				lReturn = query.record;
			}
			cb(err, lReturn);
		});
	});
};

module.exports = new MongoDbAdaptee();