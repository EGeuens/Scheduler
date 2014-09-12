"use strict";
/**
 *
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

/**
 * Converts an object to an array.
 * @param {Object} obj The object to convert
 * @returns {Object | Array} The converted array or obj when it's not an object
 */
HelperFunctions.prototype.objToArray = function (obj) {
	var lKey, lRetArr = [];

	if (!imports._.isObject(obj)) {
		return obj;
	}

	for (lKey in obj) {
		if (obj.hasOwnProperty(lKey)) {
			lRetArr.push(obj[lKey]);
		}
	}

	return lRetArr;
};

module.exports = new HelperFunctions();