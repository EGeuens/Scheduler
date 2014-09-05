"use strict";
/**
 *
 * @class core.api.util.HelperFunctions
 * @author Erwin
 * @date 5/09/2014
 */

/**
 * @constructor
 */
var HelperFunctions = function () {
	return this;
};

HelperFunctions.prototype.objToArray = function (obj) {
	var lKey, lRetArr = [];

	for (lKey in obj) {
		if (obj.hasOwnProperty(lKey)) {
			lRetArr.push(obj[lKey]);
		}
	}

	return lRetArr;
};

module.exports = new HelperFunctions();