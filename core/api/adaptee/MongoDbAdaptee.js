"use strict";
/**
 *
 * @class core.api.adaptee.MongoDbAdaptee
 * @author Erwin
 * @date 9/10/2014
 */

var imports = {
	ErrorFactory: require("../factory/ErrorFactory"),
	Config      : require("../Config"),
	Q           : require("q"),
	mongodb     : require("mongodb")
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
		me.db = imports.mongodb.Db(lMongoConfig.db, new imports.mongodb.Server(lMongoServerConfig.host, lMongoServerConfig.port, lMongoServerConfig.options), lMongoConfig.options);
		me.db.open(function (err, db) {
			try {
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

		var lCollection = db.collection(collection);
		lCollection.find(query.selector).toArray(function (err, result) {
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

		var lCollection = db.collection(collection);
		lCollection.save(record, function (err, saved) {
			cb(err, saved); //TODO check this
		});
	});
};

module.exports = new MongoDbAdaptee();