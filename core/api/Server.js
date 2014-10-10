"use strict";
/**
 * Instantiates a new instance of the server, listening on a port as defined in the config file.
 * Starts listening for socket connections too!
 * @class core.api.Server
 * @author Erwin
 * @date 5/09/2014
 */
var imports = {
		_           : require("underscore"),
		express     : require("express"),
		http        : require("http"),
		io          : require("socket.io"),
		Config      : require("./Config"),
		Environments: require("./enum/Environments"),
		Logger      : require("./util/Logger"),
		FileHandler : require("./handler/FileHandler"),
		ErrorHandler: require("./handler/ErrorHandler"),
		Module      : require("./model/Module"),
		MongoStore  : require("connect-mongo"),
		CookieParser: require("cookie-parser"),
		Session     : require("express-session"),
		BodyParser  : require("body-parser")

	},
	privates = {
		app        : null,
		io         : null,
		http       : null,
		partsReady : [],
		partsNeeded: ["setupSockets", "setupRoutes"],

		superSecret: "My_Super+5ecr3T",
		MongoStore : imports.MongoStore(imports.Session)
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
 * Complete (or at least try to complete) the server setup
 * @param part
 */
Server.prototype.completeSetup = function (part) {
	privates.partsReady.push(part);

	if (imports._.intersection(privates.partsReady, privates.partsNeeded).length === privates.partsNeeded.length) {
		imports.Logger.log(""); //log a newline
		imports.Logger.success("Server is all set up and ready to go!");
	}
};

/**
 * Initialises our server
 */
Server.prototype.init = function () {
	var me = this;

	me.initLogger();

	me.prepareServer();

	imports.Logger.log("Server is prepared! But wait, we still have to load the modules.");
	imports.Module.prototype.find({}, function (err, modules) {
		if (err) {
			imports.Logger.log("Something went wrong while loading the modules:", err);
			return;
		}

		if (modules.length) {
			imports.Logger.log("Going to configure these modules:", imports._.pluck(modules, "name").join(", "));
		}
		else {
			imports.Logger.log("No modules were found, oh well, I guess we'll do without (somehow)...");
		}
		me.setupListeners(modules);
	});
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

	imports.Logger.init("Initializing the server...", lLogLevel);
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

	me.getApp().set("port", imports.Config.port);

	me.getApp().use(imports.BodyParser.json());
	me.getApp().use(imports.BodyParser.urlencoded({
		extended: true
	}));

	me.getApp().use(imports.CookieParser(privates.superSecret));
	me.getApp().use(imports.Session({
		secret           : privates.superSecret,
		resave           : true,
		saveUninitialized: true,
		store            : new privates.MongoStore({
			db  : imports.Config.mongodb.db,
			host: imports.Config.mongodb.server.host,
			port: imports.Config.mongodb.server.port
		})
	}));
};

/**
 * Sets up listening for the http server and sockets
 */
Server.prototype.setupListeners = function (modules) {
	var me = this;

	me.setupSockets(modules);
	me.setupRoutes(modules);
};

/**
 * Setup REST API routes
 * @param modules
 */
Server.prototype.setupRoutes = function (modules) {
	var me = this,
		lServer;

	imports.Logger.log("Server going to listen on port", me.getApp().get("port"));
	lServer = me.getHttp().listen(me.getApp().get("port"), function () {
		var lModuleNames = imports._.pluck(modules, "name").join(", "),
			lAppBasePath = __dirname + "/../..",
			lModule, lModuleRouter, lRouter, i,
			lModulesFailed = 0;

		imports.Logger.log(""); // print newline
		imports.Logger.log("Server listening on port", me.getApp().get("port"));

		if (lModuleNames) {
			imports.Logger.log("Setting up API routes for:", lModuleNames);
		}
		else {
			imports.Logger.log("No routes to set up");
		}
		for (i = 0; i < modules.length; i++) {
			lModule = modules[i];
			try {
				lModuleRouter = require(lAppBasePath + lModule.rootPath + "/api/Router");
				lRouter = imports.express.Router({
					//These are the default parameters, but for clarity written out.
					caseSensitive: false,
					strict       : false,
					mergeParams  : false
				});
				lModuleRouter.setup(lRouter);
				privates.app.use(lModule.apiPath || lModule.rootPath, lRouter);
				imports.Logger.info("Setting up API routes for:", lModule.name, "was a complete success!");
			}
			catch (e) {
				lModulesFailed++;
				imports.Logger.error("Setting up API routes for:", lModule.name, "was a complete failure!\n", e.message, "\n", e.stack);
			}
		}
		if (lModulesFailed) {
			imports.Logger.error("We failed at loading", lModulesFailed, "module(s). Look above for more info.");
		}
		else {
			imports.Logger.info(modules.length, "module(s) were set up successfully!");
		}

		if (lModuleNames) {
			imports.Logger.log("Setting up static paths for:", lModuleNames);
		}
		else {
			imports.Logger.log("No static paths to set up");
		}
		//for core module send files from /core/app
		for (i = 0; i < modules.length; i++) {
			lModule = modules[i];
			privates.app.use(lModule.publicPath || lModule.rootPath, imports.FileHandler(lModule.publicPath || lModule.rootPath, lAppBasePath + lModule.rootPath + lModule.publicDir));
		}

		imports.Logger.log("Setting error 404/500 handlers");
		privates.app.use(imports.FileHandler.prototype.notFoundHandler);
		privates.app.use(imports.ErrorHandler.catchEverything);

		me.completeSetup("setupRoutes");
	});

	me.setServer(lServer);
};

/**
 * Setup WebSocket routes
 * @param modules
 */
Server.prototype.setupSockets = function (modules) {
	var me = this;

	me.getIo().on("connection", function (socket) {
		imports.Logger.info("User connected on socket", socket.id);
	});

	imports.Logger.log("Setting up WebSocket events for:", imports._.pluck(modules, "name").join(", "));
	//TODO set up WebSocket events for modules

	me.completeSetup("setupSockets");
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

Server.prototype.getServer = function () {
	return privates.server;
};

Server.prototype.setServer = function (server) {
	return privates.server = server;
};

//module.exports = new Server(); means this is a static (!) class
module.exports = new Server();