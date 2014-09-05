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
		Logger       : require("./util/Logger"),
		SocketManager: require("./manager/SocketMgr")

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
	imports.Logger.init("Initializing the Core... Hold on to yo' butts!!", imports.Logger.LOG_LEVEL_DEBUG);

	imports.Logger.info("Ante up server...");
	privates.app = imports.express();
	privates.http = imports.http.Server(privates.app);
	privates.io = imports.io(privates.http);

	imports.Logger.info("Setting parameters...");
	privates.app.set("port", imports.Config.port);

	imports.Logger.info("Sharpening ears...");
	privates.io.on("connection", function (socket) {
		imports.Logger.info("User connected on socket", socket.id);
	});
	privates.http.listen(privates.app.get("port"), function () {
		imports.Logger.log("");
		imports.Logger.info("Ears sharpened!");
		imports.Logger.log("Server listening on port", privates.app.get("port"));

		imports.Logger.info("Core initialized! It's something :)");
	});
};

new Server();