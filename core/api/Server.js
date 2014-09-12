"use strict";
/**
 * Instantiates a new instance of the server, listening on a port as defined in the config file.
 * Starts listening for socket connections too!
 * @class core.Server
 * @author Erwin
 * @date 5/09/2014
 */
var imports = {
		express      : require("express"),
		http         : require("http"),
		io           : require("socket.io"),
		Config       : require("./Config"),
		Environments : require("./enum/Environments"),
		Logger       : require("./util/Logger")

	},
	privates = {
		app : null,
		io  : null,
		http: null
	};

/**
 * @constructor
 */
var Server = function(){
	return this;
};

Server.prototype.init = function () {
	var me = this,
		lLogLevel;

	if (imports.Config.environment === imports.Environments.DEV) {
		lLogLevel = imports.Logger.LOG_LEVEL_DEBUG;
	}
	else if (imports.Config.environment === imports.Environments.PRODUCTION) {
		lLogLevel = imports.Logger.LOG_LEVEL_ERROR;
	}
	else if (imports.Config.environment === imports.Environments.TEST) {
		lLogLevel = imports.Logger.LOG_LEVEL_NONE;
	}

	imports.Logger.init("Initializing the Core... Hold on to yo' butts!!", lLogLevel);

	imports.Logger.info("Ante up server...");
	me.setApp(imports.express());
	me.setHttp(imports.http.Server(me.getApp()));
	me.setIo(imports.io(me.getHttp()));

	imports.Logger.info("Setting parameters...");
	me.getApp().set("port", imports.Config.port);

	imports.Logger.info("Sharpening ears...");
	me.getIo().on("connection", function (socket) {
		imports.Logger.info("User connected on socket", socket.id);
	});

	me.getHttp().listen(me.getApp().get("port"), function () {
		imports.Logger.log("");
		imports.Logger.info("Ears sharpened!");
		imports.Logger.log("Server listening on port", me.getApp().get("port"));

		imports.Logger.info("Core initialized! It's something :)");
	});
};

Server.prototype.setApp = function(app){
	return privates.app = app;
};

Server.prototype.getApp = function(){
	return privates.app;
};

Server.prototype.setHttp = function(http){
	return privates.http = http;
};

Server.prototype.getHttp = function(){
	return privates.http;
};

Server.prototype.setIo = function(io){
	return privates.io = io;
};

Server.prototype.getIo = function(){
	return privates.io;
};

module.exports = new Server();