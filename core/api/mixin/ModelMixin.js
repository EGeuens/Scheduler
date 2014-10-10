"use strict";
/**
 * Mixable functions for models
 * @class core.api.mixin.ModelMixin
 * @author Erwin
 * @date 9/10/2014
 */

var imports = {
		_        : require("underscore"),
		Validator: require("../util/Validator")
	},
	privates = {
		mixables: ["validate", "toModel"]
	};

/**
 * @constructor
 */
var ModelMixin = function () {
	return this;
};

////
// Public methods
////
/**
 * Mixin this class' functionality (find, validate)
 * @param clazz The class to mix into
 */
ModelMixin.prototype.mixin = function (clazz) {
	imports._.each(privates.mixables, function (mixable) {
		clazz.prototype[mixable] = ModelMixin.prototype[mixable];
	});
};

////
// Mixables
////
ModelMixin.prototype.validate = function () {
	var me = this;

	return imports.Validator.validateModel(me, me.getModelDefinition());
};

ModelMixin.prototype.toModel = function () {
	var me = this,
		lKey, lReturn = {};

	for (lKey in me.getModelDefinition()) {
		if (me.hasOwnProperty(lKey)) {
			lReturn[lKey] = me[lKey];
		}
	}

	return lReturn;
};

module.exports = new ModelMixin();