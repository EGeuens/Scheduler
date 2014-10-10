"use strict";
/**
 * File handling express middleware
 * @class {core.api.handler.FileHandler}
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
var FileHandler = function (rootPath, basePath) {
	return function (req, res, next) {
		var lUrl = req.originalUrl === "/" ? "index.html" : req.originalUrl,
			lSendFile;

		lUrl = lUrl.replace(rootPath, "");

		if (basePath.lastIndexOf("/") !== basePath.length - 1) {
			basePath += "/";
		}

		lSendFile = imports.path.resolve(basePath + lUrl);

		imports.fs.exists(lSendFile, function (exists) {
			if (!exists) {
				next(); // let the 404 cathcer do it's thing
				return;
			}

			imports.Logger.debug(lUrl, "was requested... Sending", lSendFile, "... NOW!");
			res.sendFile(lSendFile);
		});
	};
};

FileHandler.prototype.notFoundHandler = function (req, res, next) {
	imports.Logger.log("404! Requested URL:", req.originalUrl);
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.sendFile(imports.path.resolve(__dirname + "/../../app/404.html"));
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
};

module.exports = FileHandler;