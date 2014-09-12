"use strict";
/**
 * Configuration file for the application
 * @class core.api.Config
 * @author Erwin
 * @date 5/09/2014
 */
var imports = {
		Environments: require("./enum/Environments")
};

var Config = {
		apiBase    : "api",
		environment: imports.Environments.DEV,
		port    : 9001,
		testPort: 9002
	};

module.exports = Config;