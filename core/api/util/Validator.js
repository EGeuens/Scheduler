"use strict";
/**
 * Validator class to help ease validation processes
 * @class core.api.util.Validator
 * @author Erwin
 * @date 19/09/2014
 */
var imports = {
		_: require("underscore")
	},
	privates = {
		validations: {
			"required"    : new RegExp("\\S", "i"),
			"number"      : new RegExp("\\d+", "i"),
			"alphabetic"  : new RegExp("[a-zA-Z]+", "i"),
			"alphanumeric": new RegExp("[a-zA-Z\\d]+", "i"),
			"email"       : new RegExp("[a-z]+@[a-z]+\\.com", "i")
		}
	};

/**
 * @constructor
 */
var Validator = function () {
	return this;
};

////
// Public methods
///
Validator.prototype.checkType = function (val, type) {
	switch (type) {
		case String:
			return imports._.isString(val);
		case Number:
			return imports._.isNumber(val);
		default :
			return true;
	}
};

Validator.prototype.validateModel = function (instance, modelDef) {
	var me = this,
		lSuccess = true,
		lValidated;

	for (var lProp in instance) {
		if (instance.hasOwnProperty(lProp)) {
			lValidated = (!modelDef.hasOwnProperty(lProp) || !me.validateProperty(instance[lProp], modelDef[lProp]));
			if (lValidated) {
				lSuccess = false;
			}
		}
	}
	return lSuccess;
};

Validator.prototype.validateProperty = function (propVal, prop) {
	var me = this,
		lValidations = prop.validate,
		lValidation, i,
		lSuccess = true;

	if (!lValidations) {
		return true;
	}

	if (!imports._.isArray(lValidations)) {
		lValidations = [lValidations];
	}

	if (!propVal && !imports._.contains(lValidations, "required")) {
		return true;
	}

	if (!me.checkType(propVal, prop.type)) {
		return false;
	}

	for (i = 0; i < lValidations.length; i++) {
		lValidation = lValidations[i];

		if (privates.validations.hasOwnProperty(lValidation)) {
			if (!privates.validations[lValidation].test(propVal)) {
				lSuccess = false;
			}
		}
		else {
			//validate using regex on property
			if (!prop[lValidation] || !imports._.isRegExp(prop[lValidation])) {
				lSuccess = false;
			}
			else if (!prop[lValidation].test(propVal)) {
				lSuccess = false;
			}
		}
	}

	return lSuccess;
};

// module.exports = new Validator(); means this is a static (!) class
module.exports = new Validator();