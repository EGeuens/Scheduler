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

Router.prototype.setup = function (router) {
	router.get("/bla", function (req, res) {
		res.send(200, { message: "hi" });
	});
};

module.exports = new Router();