"use strict";
/**
 * Log handler, allows you to say something to the nerds!
 * @class core.api.util.Logger
 * @author Erwin
 * @date 5/09/2014
 */

var imports = {
		colors         : require("colors"),
		HelperFunctions: require("./HelperFunctions"),
		Messages       : require("../enum/Messages")
	},
	privates = {
		logLevel: 0,

		logColors: {
			error: "red",
			warn : "yellow",
			info : "blue",
			debug: "magenta",
			log  : "black",
			fun  : "rainbow"
		},

		doLog: function (type, lvl, originalArgs, color) {
			if (privates.logLevel > lvl) {
				return;
			}

			try {
				var lArgs = imports.HelperFunctions.objToArray(originalArgs),
					lArg, lMessage;

				for (var i = 0; i < lArgs.length; i++) {
					lArg = lArgs[i];
					if (typeof lArg === "object") {
						lArgs[i] = JSON.stringify(lArg);
					}
				}

				lMessage = lArgs.join(" ");
				console[type].call(this, lMessage[color]);
			}
			catch (e) {
				console.error(imports.Messages.ERROR_WHILE_LOGGING, e.stack);
			}
		}
	};

/**
 * @constructor
 */
function Logger() {
	return this;
}

/**
 * Log level severity used for debugging
 * @type {number}
 */
Logger.prototype.LOG_LEVEL_NONE = 0;

/**
 * Log level severity used for debugging
 * @type {number}
 */
Logger.prototype.LOG_LEVEL_DEBUG = 10;

/**
 * Log level severity used for informative messages
 * @type {number}
 */
Logger.prototype.LOG_LEVEL_INFO = 20;

/**
 * Log level severity used for error messages
 * @type {number}
 */
Logger.prototype.LOG_LEVEL_ERROR = 30;

/**
 * Set the severity level of the application
 */
Logger.prototype.init = function (msg, severity) {
	if(msg){
		console.log(msg[privates.logColors.log]);
	}
	console.log("Initializing logger... Get ready for some fast and furious messaging!!"[privates.logColors.fun], "\nWe're using colors!".rainbow,
		("\nErrors are in " + privates.logColors.error + ".")[privates.logColors.error], ("Warnings are in " + privates.logColors.warn + ".")[privates.logColors.warn],
		("Information is in " + privates.logColors.info + ".")[privates.logColors.info], ("Debug messages are in " + privates.logColors.debug + ".")[privates.logColors.debug],
		("Log messages are in " + privates.logColors.log + ".")[privates.logColors.log], "\nRainbow is for fun :)\n".rainbow);

	this.setLogLevel(severity);
};

/**
 * Set the severity level of the application
 */
Logger.prototype.setLogLevel = function (severity) {
	if (severity !== Logger.prototype.LOG_LEVEL_INFO && severity !== Logger.prototype.LOG_LEVEL_DEBUG && severity !== Logger.prototype.LOG_LEVEL_ERROR) {
		Logger.prototype.error(imports.Messages.ERROR_UNKNOWN_SEVERITY_LEVEL, ":", severity);
		severity = Logger.prototype.LOG_LEVEL_NONE;
	}

	privates.logLevel = severity;
	Logger.prototype.info(imports.Messages.SEVERITY_LEVEL_SET_TO, severity);
};

/**
 * Get the severity level of the application
 */
Logger.prototype.getLogLevel = function () {
	return privates.logLevel;
};

/**
 * Log a general message
 */
Logger.prototype.log = function () {
	privates.doLog("log", privates.logLevel, arguments, privates.logColors.log);
};

/**
 * Log an informative message
 */
Logger.prototype.info = function () {
	privates.doLog("info", Logger.prototype.LOG_LEVEL_INFO, arguments, privates.logColors.info);
};

/**
 * Log a warning message
 */
Logger.prototype.warn = function () {
	privates.doLog("log", Logger.prototype.LOG_LEVEL_INFO, arguments, privates.logColors.warn);
};

/**
 * Log an error message
 */
Logger.prototype.error = function () {
	privates.doLog("error", Logger.prototype.LOG_LEVEL_ERROR, arguments, privates.logColors.error);
};

/**
 * Log a debug message
 */
Logger.prototype.debug = function () {
	privates.doLog("info", Logger.prototype.LOG_LEVEL_DEBUG, arguments, privates.logColors.debug);
};

module.exports = new Logger();