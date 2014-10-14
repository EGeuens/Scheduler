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
	CONTEXT_ALREADY_RESPONDED     : "The context has already responded",
	ERROR_WHILE_LOGGING           : "We are logging this message to tell you that something went wrong while logging another message",
	ERROR_UNKNOWN_SEVERITY_LEVEL  : "An incorrect severity level has been set :0",
	INVALID_PASSWORD              : "This is not the password you are looking for...",
	NO_SETTER_FOUND_FOR           : "No setter was found for property:",
	SEVERITY_LEVEL_SET_TO         : "Logger severity level now set to:",
	TRYING_TO_SET_INVALID_PROPERTY: "Trying to set invalid property:",
	UNKNOWN_USER                  : "That username is not known to us...",
	UNHANDLED_EXCEPTION           : "An unhandled exception has occurred. Too bad, so sad..."
};

module.exports = Messages;