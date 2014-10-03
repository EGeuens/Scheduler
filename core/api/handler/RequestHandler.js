"use strict";
/**
 * Handles all incoming and outgoing requests! TODO - finish him!
 * @class {core.api.handler.RequestHandler}
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

////
// Public methods
////
/**
 * Handles the incoming request
 * @param url {String}
 * @param context {Object}
 */
RequestHandler.prototype.handle = function (url, context) {
	var lUrlParts = url.split("/"),
		lIsApiCall, lHandler;

	lUrlParts.shift();
	lIsApiCall = lUrlParts[0] === imports.Config.apiBase;

	if (lIsApiCall) {
		lUrlParts.shift();
		lHandler = RequestHandler.prototype.getApiHandler();
		lHandler.handle("/" + lUrlParts.join("/"), context);
	}

};

////
// Getters/Setters
////
/**
 * @returns {core.api.handler.ApiHandler}
 */
RequestHandler.prototype.getApiHandler = function () {
	return privates.ApiHandler;
};

//module.exports = RequestHandler; means that this is just an ordinary class
module.exports = new RequestHandler();