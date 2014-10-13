"use strict";
/**
 * Core routes
 * @class core.api.Router
 * @author Erwin
 * @date 8/10/2014
 */

/**
 * @constructor
 */
var Router = function () {
	return this;
};

/**
 * Setup the routes needed for the core
 * @param router
 */
Router.prototype.setup = function (router) {
	router.get("/modules", function (req, res) {
		var lModule = require("./model/Module"),
			lQuery = req.query;

		lModule.prototype.find(lQuery, function (err, modules) {
			if (err) {
				res.status(400).send(err);
				return;
			}
			res.status(200).send(modules);
		});
	});
	router.get("/bla", function (req, res) {
		res.status(200).send({ message: "hi" });
	});
};

module.exports = new Router();