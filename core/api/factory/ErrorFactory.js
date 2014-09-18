"use strict";
/**
 *
 * @class core.api.factory.ErrorFactory
 * @author Erwin
 * @date 18/09/2014
 */

var imports = {
	_: require("underscore")
};

/**
 * @constructor
 */
var ErrorFactory = function () {
	return this;
};

ErrorFactory.prototype.create = function () {
	var lMsg = imports._.toArray(arguments);
	return new Error(lMsg.join(" "));
};

//module.exports = new Server(); means this is a static (!) class
module.exports = new ErrorFactory();