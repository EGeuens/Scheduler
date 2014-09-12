"use strict";
/**
 * Instantiates a new instance of the server, listening on a port as defined in the config file.
 * Starts listening for socket connections too!
 * @class core.api.Server
 * @author Erwin
 * @date 5/09/2014
 */
var imports = {
		express     : require("express"),
		http        : require("http"),
		io          : require("socket.io"),
		Config      : require("./Config"),
		Environments: require("./enum/Environments"),
		Logger      : require("./util/Logger")

	},
	privates = {
		app : null,
		io  : null,
		http: null
	};

/**
 * @constructor
 */
var Server = function () {
	return this;
};

////
// Public methods
////
/**
 * Closes the listening http server and sockets
 */
Server.prototype.close = function () {
	var me = this;
	if (me.getHttp()) {
		try {
			me.getHttp().close();
		}
		catch (e) {
			imports.Logger.warn("http server already closed");
		}
	}
	if (me.getIo()) {
		try {
			me.getIo().close();
		}
		catch (e) {
			imports.Logger.warn("socket server already closed");
		}
	}
};

/**
 * Initialises our server
 */
Server.prototype.init = function () {
	var me = this;

	me.initLogger();
	me.prepareServer();
	me.setupParameters();
	me.setupListeners();
};

/**
 * Initialises the logger
 */
Server.prototype.initLogger = function () {
	var lLogLevel;

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
};

/**
 * Prepares our server by initialising up express, http and socket.io
 */
Server.prototype.prepareServer = function () {
	var me = this;

	imports.Logger.info("Preparing server...");
	me.setApp(imports.express());
	me.setHttp(imports.http.Server(me.getApp()));
	me.setIo(imports.io(me.getHttp()));

};

/**
 * Sets up listening for the http server and sockets
 */
Server.prototype.setupListeners = function () {
	var me = this;

	imports.Logger.info("Sharpening ears...");
	var tmpIoConnCB = function (socket) {
		imports.Logger.info("User connected on socket", socket.id);
	};
	me.getIo().on("connection", tmpIoConnCB);

	var tmpHttpListenCB = function () {
		imports.Logger.log(""); // print newline
		imports.Logger.info("Ears sharpened!");
		imports.Logger.log("Server listening on port", me.getApp().get("port"));

		imports.Logger.info("Core initialized! It's something :)");
	};
	me.getHttp().listen(me.getApp().get("port"), tmpHttpListenCB);
};

/**
 * Set application parameters
 */
Server.prototype.setupParameters = function () {
	var me = this;
	imports.Logger.info("Setting parameters...");
	me.getApp().set("port", imports.Config.port);
};

////
// Getters/Setters
////
/**
 * @param {express} app
 * @returns {express} app
 */
Server.prototype.setApp = function (app) {
	return privates.app = app;
};

/**
 * @returns {express} app
 */
Server.prototype.getApp = function () {
	return privates.app;
};

/**
 * @param {http} http
 * @returns {http} http
 */
Server.prototype.setHttp = function (http) {
	return privates.http = http;
};

/**
 * @returns {http} http
 */
Server.prototype.getHttp = function () {
	return privates.http;
};

/**
 * @param {socket.io} io
 * @returns {socket.io} io
 */
Server.prototype.setIo = function (io) {
	return privates.io = io;
};

/**
 * @returns {socket.io} io
 */
Server.prototype.getIo = function () {
	return privates.io;
};

//module.exports = new Server(); means this is a static (!) class
module.exports = new Server();