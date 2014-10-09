"use strict";
/**
 * Creates models!
 * @class core.api.factory.ModelFactory
 * @author Erwin
 * @date 9/10/2014
 */

var imports = {
	Logger      : require("../util/Logger"),
	Messages    : require("../enum/Messages"),
	ModelMixin  : require("../mixin/ModelMixin"),
	ErrorFactory: require("./ErrorFactory")
};

/**
 * @constructor
 */
var ModelFactory = function () {
	return this;
};

/**
 * Create a model constructor based on a model definition
 * @param model
 * @returns {Function}
 */
ModelFactory.prototype.create = function (model) {
	var lCtor = function (conf) {
		var me = this, //"this" === function(conf)
			lKey;

		//Set defaults
		for (lKey in model) {
			if (model.hasOwnProperty(lKey)) {
				me[lKey] = model[lKey].default;
			}
		}

		//Apply config
		for (lKey in conf) {
			if (conf.hasOwnProperty(lKey)) {
				if (!model.hasOwnProperty(lKey)) {
					imports.Logger.warn(imports.Messages.TRYING_TO_SET_INVALID_PROPERTY, lKey);
					continue;
				}

				var lCapitalizedKey = lKey.charAt(0).toUpperCase() + lKey.substr(1),
					lSetter = ["set", lCapitalizedKey].join("");

				if (!me[lSetter]) {
					throw imports.ErrorFactory.create(imports.Messages.NO_SETTER_FOUND_FOR, lKey);
				}

				me[lSetter](conf[lKey]);
			}
		}

		return this;
	};

	imports.ModelMixin.mixin(lCtor);

	return lCtor;
};

module.exports = new ModelFactory();