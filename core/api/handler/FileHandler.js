"use strict";
/**
 * TODO - finish him!
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
			console.warn("help", exists);
			if (!exists) {
				next(); // let the 404 cathcer do it's thing
				return;
			}

			imports.Logger.debug(lUrl, "was requested... Sending", lSendFile, "... NOW!");
			res.sendFile(lSendFile);
		});
	};
};

module.exports = FileHandler;