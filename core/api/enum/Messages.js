"use strict";
/**
 * All messages used in the application
 * @class core.api.enum.Messages
 * @author Erwin
 * @date 5/09/2014
 */

/**
 * @constructor
 */
var Messages = {
	ERROR_WHILE_LOGGING           : "We are logging this message to tell you that something went wrong while logging another message",
	ERROR_UNKNOWN_SEVERITY_LEVEL  : "An incorrect severity level has been set :0",
	NO_SETTER_FOUND_FOR           : "No setter was found for property:",
	SEVERITY_LEVEL_SET_TO         : "Logger severity level now set to:",
	TRYING_TO_SET_INVALID_PROPERTY: "Trying to set invalid property:"
};

module.exports = Messages;