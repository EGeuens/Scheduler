"use strict";
/**
 * Error handling express middleware
 * @class {core.api.handler.ErrorHandler}
 * @author Erwin
 * @date 12/09/2014
 */

var imports = {
		fs    : require("fs"),
		path  : require("path"),
		Logger: require("../util/Logger")
	},
	privates = {
	};

/**
 * @constructor
 */
var ErrorHandler = function () {
	return this;
};

ErrorHandler.prototype.catchEverything = function (err, req, res, next) {
	res.status(500);

	// respond with html page
	if (req.accepts('html')) {
		res.sendFile(imports.path.resolve(__dirname + "/../../app/500.html"));
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Something broke, badly...' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Something broke, badly...');
};

module.exports = new ErrorHandler();