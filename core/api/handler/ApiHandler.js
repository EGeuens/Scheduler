"use strict";
/**
 *
 * @class ApiHandler
 * @author Erwin
 * @date 14/10/2014
 */

var imports = {
		Messages: require("../enum/Messages"),
		Context : require("../model/Context"),
		Passport: require("passport")
	},
	privates = {
		router: null,

		provideContext: function (uri, fn, authenticate, roles) {
			return function (req, res, next) {
				var lContext = new imports.Context({
					request      : req,
					response     : res,
					current      : fn,
					authenticate : authenticate,
					authorisation: roles
				});

				try {
					lContext.execute();
				}
				catch (e) {
					next({ message: imports.Messages.UNHANDLED_EXCEPTION});
				}
			};
		}
	};

/**
 * @constructor
 */
var ApiHandler = function (router) {
	privates.router = router;

	return this;
};

ApiHandler.prototype.post = function (uri, fn, authenticate, roles) {
	privates.router.post(uri, privates.provideContext(uri, fn, authenticate, roles));
};

/**
 * Handle a GET request
 * @param uri
 * @param fn The api-point handler function
 * @param [authenticate] defaults to false
 * @param [roles] defaults to everyone
 */
ApiHandler.prototype.get = function (uri, fn, authenticate, roles) {
	privates.router.get(uri, privates.provideContext(uri, fn, authenticate, roles));
};

module.exports = ApiHandler;