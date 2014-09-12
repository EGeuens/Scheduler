"use strict";
/**
 * Handles all incoming and outgoing requests!
 * @class RequestHandler
 * @author Erwin
 * @date 12/09/2014
 */
var imports = {
		ApiHandler : require("./ApiHandler"),
		FileHandler: require("./FileHandler"),
		Config     : require("../Config")
	},
	privates = {
		ApiHandler : new imports.ApiHandler(),
		FileHandler: new imports.FileHandler()
	};
/**
 * @constructor
 */
var RequestHandler = function () {
	return this;
};

RequestHandler.prototype.getApiHandler = function () {
	return privates.ApiHandler;
};

RequestHandler.prototype.getFileHandler = function () {
	return privates.FileHandler;
};

RequestHandler.prototype.handle = function (url) {
	var me = this,
		lUrlParts = url.split("/"),
		lIsApiCall, lHandler;

	lUrlParts.shift();
	lIsApiCall = lUrlParts[0] === imports.Config.apiBase;

	if (lIsApiCall) {
		lUrlParts.shift();
		lHandler = me.getApiHandler();
	}
	else {
		lHandler = me.getFileHandler();
	}

	lHandler.handle("/" + lUrlParts.join("/"));
};

module.exports = RequestHandler;