"use strict";
/**
 * Core routes
 * @class core.api.Router
 * @author Erwin
 * @date 8/10/2014
 */

var imports = {
		ApiHandler: require("./handler/ApiHandler")
	},
	privates = {
		ApiHandler: null
	};

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
	privates.ApiHandler = new imports.ApiHandler(router);

	//	var passport = require("passport");
	//	router.post("/login", passport.authenticate("local"), function (req, res) {
	//		console.log("Happy");
	//		res.status(200).send({ message: "yihaa"});
	//	});

	var lModule = require("./model/Module");
	privates.ApiHandler.get("/modules", lModule.prototype.find);

	router.get("/bla", function (req, res) {
		res.status(200).send({ message: "hi" });
	});
};

module.exports = new Router();