"use strict";
/**
 * Core routes
 * @class core.api.Router
 * @author Erwin
 * @date 8/10/2014
 */

var imports = {
		ApiHandler: require("./handler/ApiHandler"),
		passport  : require("passport"),
		Module    : require("./model/Module"),
		User      : require("./model/User")
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

	router.post("/login", imports.passport.authenticate("local"), function (req, res) {
		res.status(200).send({ message: "yihaa"});
	});
	router.post("/logout", function (req, res) {
		req.logout();
		res.status(200).send({message: "logged out"});
	});

	privates.ApiHandler.get("/modules", imports.Module.prototype.find);
	privates.ApiHandler.get("/users", imports.User.prototype.find);
	privates.ApiHandler.post("/users", imports.User.prototype.save, true);
};

module.exports = new Router();