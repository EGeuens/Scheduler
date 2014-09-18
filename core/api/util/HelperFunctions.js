"use strict";
/**
 * Nifty doo-a-ma-things that help in any way possible
 * @class core.api.util.HelperFunctions
 * @author Erwin
 * @date 5/09/2014
 */
var imports = {
	_: require("underscore")
};

/**
 * @constructor
 */
var HelperFunctions = function () {
	return this;
};

////
// Public methods
////
/**
 * Converts an object to an array.
 * @param {Object} obj The object to convert
 * @returns {Object | Array} The converted array or obj when it's not of a real object
 */
HelperFunctions.prototype.objToArray = function (obj) {
	if (!imports._.isObject(obj)) {
		return obj;
	}
	return imports._.toArray(obj);
};

//module.exports = new HelperFunctions(); means this is a static (!) class
module.exports = new HelperFunctions();