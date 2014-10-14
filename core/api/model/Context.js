"use strict";
/**
 *
 * @class core.api.model.Context
 * @author Erwin
 * @date 14/10/2014
 */

var imports = {
		Messages    : require("../enum/Messages"),
		ModelFactory: require("../factory/ModelFactory"),
		ErrorFactory: require("../factory/ErrorFactory")
	},
	privates = {
		hasResponded : false,
		request      : null,
		response     : null,
		current      : null,
		authenticate : null,
		authorisation: null,
		query        : null
	};

/**
 * @constructor
 */
var Context = function (conf) {
	var me = this;

	me.setRequest(conf.request);
	me.setResponse(conf.response);
	me.setCurrent(conf.current);
	me.setAuthenticate(conf.authenticate);
	me.setAuthorisation(conf.authorisation);

	return me;
};

////
// Public methods
////
Context.prototype.execute = function () {
	var me = this;

	if (me.getAuthenticate()) {
		//TODO handle authentication
		return false;
	}

	if (me.getAuthorisation().length > 0) {
		//TODO handle authorisation
		return false;
	}

	me.getCurrent()(me, function (err, result) {
		if (err) {
			return me.getResponse().status(400).send(
				imports.ErrorFactory.create("Code:", err.code, "Message:", err.message)
			);
		}

		if (!privates.hasResponded) {
			privates.hasResponded = true;
			return me.getResponse().status(200).send(result);
		}
	});
};

/**
 * Convenience method to check if an object is an instance of this class
 * @returns {boolean} Always true :)
 */
Context.prototype.isContext = function () {
	return true;
};

/**
 * Mixin override (model is not exposed)
 * @returns {null}
 */
Context.prototype.toModel = function () {
	return null;
};

////
// Getters/setters
////
Context.prototype.getModelDefinition = function () {
	return privates.model;
};

Context.prototype.getRequest = function () {
	return privates.request;
};

Context.prototype.setRequest = function (request) {
	privates.request = request;
};

Context.prototype.getResponse = function () {
	return privates.response;
};

Context.prototype.setResponse = function (response) {
	privates.hasResponded = false;
	privates.response = response;
};

Context.prototype.getCurrent = function () {
	return privates.current;
};

Context.prototype.setCurrent = function (current) {
	privates.current = current;
};

Context.prototype.getAuthenticate = function () {
	return privates.authenticate;
};

Context.prototype.setAuthenticate = function (authenticate) {
	authenticate = authenticate || false;
	privates.authenticate = authenticate;
};

Context.prototype.getAuthorisation = function () {
	return privates.authorisation;
};

Context.prototype.setAuthorisation = function (authorisation) {
	authorisation = authorisation || [];
	privates.authorisation = authorisation;
};

Context.prototype.getQuery = function () {
	var me = this,
		lRequest = me.getRequest();

	if (lRequest.method.toUpperCase() === "GET") {
		privates.query = lRequest.query;
	}
	else {
		privates.query = lRequest.body;
	}

	return privates.query;
};

module.exports = Context;