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
		Messages: require("../enum/Messages")
	},
	privates = {
		logLevel: undefined,

		logColors: {
			error  : "red",
			warn   : "yellow",
			info   : "blue",
			debug  : "magenta",
			log    : "black",
			success: "green",
			fun    : "rainbow"
		},

		/**
		 * Do the logging
		 * @param type
		 * @param lvl
		 * @param originalArgs
		 * @param color
		 */
		doLog: function (type, lvl, originalArgs, color) {
			var me = this;

			if (me.getLogLevel() > lvl) {
				return;
			}

			try {
				var lArgs = imports.HelperFunctions.objToArray(originalArgs),
					lArg, lMsg;

				for (var i = 0; i < lArgs.length; i++) {
					lArg = lArgs[i];
					if (typeof lArg === "object") {
						lArgs[i] = JSON.stringify(lArg);
					}
				}

				lMsg = lArgs.join(" ");

				if (lMsg) {
					lMsg = ["[" + type.toUpperCase() + "]", lMsg].join(" ");
				}
				console.log.call(this, lMsg[color]);
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
	var me = this;
	//set default log level to nothing!
	me.setLogLevel(me.LOG_LEVEL_NONE);

	return me;
}

////
// Public properties
////
/**
 * Log level severity used for debugging
 * @type {Number}
 */
Logger.prototype.LOG_LEVEL_DEBUG = 10;

/**
 * Log level severity used for error messages
 * @type {Number}
 */
Logger.prototype.LOG_LEVEL_ERROR = 30;

/**
 * Log level severity used for informative messages
 * @type {Number}
 */
Logger.prototype.LOG_LEVEL_INFO = 20;

/**
 * Default log level. No messages will be logged if this is set!
 * @type {Number}
 */
Logger.prototype.LOG_LEVEL_NONE = 9999;

/**
 * Log level severity used for testing
 * @type {Number}
 */
Logger.prototype.LOG_LEVEL_TEST = 0; //show everything!

////
// Public methods
////
/**
 * Initialises the logger
 * @param {String} [msg] The startup message
 * @param {Number} [severity] The severity of the logging (LOG_LEVEL_XXX)
 */
Logger.prototype.init = function (msg, severity) {
	if (msg) {
		console.log(msg[privates.logColors.log]);
	}
	console.log("Initializing logger... Get ready for some fast and furious messaging!!"[privates.logColors.fun], "\nWe're using colors!".rainbow,
		("\nErrors are in " + privates.logColors.error + ".")[privates.logColors.error], ("Warnings are in " + privates.logColors.warn + ".")[privates.logColors.warn],
		("Information is in " + privates.logColors.info + ".")[privates.logColors.info], ("Debug messages are in " + privates.logColors.debug + ".")[privates.logColors.debug],
		("Log messages are in " + privates.logColors.log + ".")[privates.logColors.log], "\nRainbow is for fun :)\n".rainbow);

	this.setLogLevel(severity);
};

/**
 * Log a debug message
 */
Logger.prototype.debug = function () {
	var me = this;
	privates.doLog.call(me, "debug", Logger.prototype.LOG_LEVEL_DEBUG, arguments, privates.logColors.debug);
};

/**
 * Log an error message
 */
Logger.prototype.error = function () {
	var me = this;
	privates.doLog.call(me, "error", Logger.prototype.LOG_LEVEL_ERROR, arguments, privates.logColors.error);
};

/**
 * Log an informative message
 */
Logger.prototype.info = function () {
	var me = this;
	privates.doLog.call(me, "info", Logger.prototype.LOG_LEVEL_INFO, arguments, privates.logColors.info);
};

/**
 * Log a general message
 */
Logger.prototype.log = function () {
	var me = this;
	privates.doLog.call(me, "log", me.getLogLevel(), arguments, privates.logColors.log);
};

/**
 * Log a success message
 */
Logger.prototype.success = function () {
	var me = this;
	privates.doLog.call(me, "success", me.getLogLevel(), arguments, privates.logColors.success);
};

/**
 * Log a warning message
 */
Logger.prototype.warn = function () {
	var me = this;
	privates.doLog.call(me, "log", Logger.prototype.LOG_LEVEL_INFO, arguments, privates.logColors.warn);
};

////
// Getters/Setters
////
/**
 * Set the severity level of the application
 * @param {Number} [severity] The severity of the logging (LOG_LEVEL_XXX)
 */
Logger.prototype.setLogLevel = function (severity) {
	var me = this;
	if (severity !== me.LOG_LEVEL_INFO && severity !== me.LOG_LEVEL_DEBUG && severity !== me.LOG_LEVEL_ERROR && severity !== me.LOG_LEVEL_NONE && severity !== me.LOG_LEVEL_TEST) {
		me.error(imports.Messages.ERROR_UNKNOWN_SEVERITY_LEVEL, ":", severity);
		severity = me.LOG_LEVEL_NONE;
	}

	privates.logLevel = severity;
	if (severity !== me.LOG_LEVEL_TEST) { // suppress info message for testing
		me.info(imports.Messages.SEVERITY_LEVEL_SET_TO, severity);
	}
};

/**
 * Get the severity level of the application
 * @return {Number}
 */
Logger.prototype.getLogLevel = function () {
	return privates.logLevel;
};

// module.exports = new Logger(); means this is a static (!) class
module.exports = new Logger();