"use strict";
var imports = {
	Logger      : require("../../api/util/Logger"),
	Environments: require("../../api/enum/Environments"),
	Config      : require("../../api/Config"),
	Server      : require("../../api/Server"),
	express     : require("express"),
	http        : require("http"),
	io          : require("socket.io")
};

describe("Server", function () {
	var lModules = [
		{
			name       : "Core",
			version    : "0.1",
			rootPath   : "/core",
			apiPath    : "/",
			"publicDir": "/app"
		},
		{
			name       : "Scheduler",
			version    : "0.1",
			rootPath   : "/scheduler",
			"publicDir": "/app"
		}
	];

	beforeEach(function () {
		//setup test environment for the server
		imports.Config.environment = imports.Environments.TEST;
		imports.Config.port = imports.Config.testPort;
	});

	afterEach(function () {
		imports.Server.close();
	});

	describe("init", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "log"); // prevent log from showing up in tests
			spyOn(imports.Server, "initLogger");
			spyOn(imports.Server, "prepareServer");
			spyOn(imports.Server, "setupParameters");
			spyOn(imports.Server, "setupListeners");
		});

		it("should initialise the server", function () {
			imports.Server.init();

			expect(imports.Server.initLogger).toHaveBeenCalled();
			expect(imports.Server.prepareServer).toHaveBeenCalled();
			expect(imports.Server.setupParameters).toHaveBeenCalled();
			expect(imports.Server.setupListeners).toHaveBeenCalled();
		});
	});

	describe("initLogger", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "init");
		});

		it("should initialise the Logger", function () {
			imports.Server.initLogger();

			expect(imports.Logger.init).toHaveBeenCalled();
		});
	});

	describe("prepareServer", function () {
		beforeEach(function () {
			//Callthroughs because otherwise setHttp and setIo don't work
			spyOn(imports.Server, "setApp").andCallThrough();
			spyOn(imports.Server, "setHttp").andCallThrough();
			spyOn(imports.Server, "setIo").andCallThrough();
		});

		it("should prepare the server (setup app, http and io privates)", function () {
			imports.Server.prepareServer();

			expect(imports.Server.setApp).toHaveBeenCalled();
			expect(imports.Server.setHttp).toHaveBeenCalled();
			expect(imports.Server.setIo).toHaveBeenCalled();
		});
	});

	describe("setupParameters", function () {
		beforeEach(function () {
			imports.Server.setApp(imports.express());
		});

		it("should prepare the server (setup app, http and io privates)", function () {
			imports.Server.setupParameters();

			expect(imports.Server.getApp().get("port")).toBe(imports.Config.port);
			expect(imports.Server.getApp().get("port")).toBe(imports.Config.testPort); //nope, not paranoid xD
		});
	});

	describe("setupListeners", function () {
		beforeEach(function () {
			imports.Server.setApp(imports.express());
			imports.Server.setHttp(imports.http.Server(imports.Server.getApp()));
			imports.Server.setIo(imports.io(imports.Server.getHttp()));

			spyOn(imports.Server, "setupRoutes");
			spyOn(imports.Server, "setupSockets");
		});

		it("should setup the listener (http and sockets)", function () {
			var lModules = [
				{
					name       : "Core",
					version    : "0.1",
					rootPath   : "/core",
					apiPath    : "/",
					"publicDir": "/app"
				},
				{
					name       : "Scheduler",
					version    : "0.1",
					rootPath   : "/scheduler",
					"publicDir": "/app"
				}
			];

			imports.Server.setupListeners(lModules);

			expect(imports.Server.setupRoutes).toHaveBeenCalledWith(lModules);
			expect(imports.Server.setupSockets).toHaveBeenCalledWith(lModules);
		});
	});

	describe("close", function () {
		beforeEach(function () {
			imports.Server.setApp(imports.express());
			imports.Server.setHttp(imports.http.Server(imports.Server.getApp()));
			imports.Server.setIo(imports.io(imports.Server.getHttp()));

			spyOn(imports.Server.getHttp(), "close");
			spyOn(imports.Server.getIo(), "close");
		});

		it("close the connection", function () {
			imports.Server.close();

			expect(imports.Server.getHttp().close).toHaveBeenCalled();
			expect(imports.Server.getIo().close).toHaveBeenCalled();
		});
	});

	describe("setupRoutes", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "log"); // prevent log from showing up in tests

			imports.Server.setApp(imports.express());
			imports.Server.setHttp(imports.http.Server(imports.Server.getApp()));
			imports.Server.setIo(imports.io(imports.Server.getHttp()));

			spyOn(imports.Server, "completeSetup");
			spyOn(imports.Server.getHttp(), "listen").andCallFake(function (port, cb) {
				cb();
			});
		});

		it("should setup the listener (http)", function () {
			imports.Server.setupRoutes(lModules);

			expect(imports.Server.getHttp().listen).toHaveBeenCalled();
			expect(imports.Server.completeSetup).toHaveBeenCalledWith("setupRoutes");
		});
	});

	describe("setupSockets", function () {
		var lSocket = {};

		beforeEach(function () {
			spyOn(imports.Logger, "log"); // prevent log from showing up in tests

			imports.Server.setApp(imports.express());
			imports.Server.setHttp(imports.http.Server(imports.Server.getApp()));
			imports.Server.setIo(imports.io(imports.Server.getHttp()));

			spyOn(imports.Server, "completeSetup");
			spyOn(imports.Server.getIo(), "on").andCallFake(function (event, cb) {
				cb(lSocket);
			});
		});

		it("should setup the listener (sockets)", function () {
			imports.Server.setupSockets(lModules);

			expect(imports.Server.getIo().on).toHaveBeenCalled();
			expect(imports.Server.completeSetup).toHaveBeenCalledWith("setupSockets");
		});
	});

	describe("completeSetup", function () {
		var lSocket = {};

		beforeEach(function () {
			spyOn(imports.Logger, "log"); // prevent log from showing up in tests
			spyOn(imports.Logger, "success");
		});

		it("should wait until all expected parts have called the function to log a success message", function () {
			imports.Server.completeSetup("setupSockets");
			expect(imports.Logger.success).not.toHaveBeenCalled();

			imports.Server.completeSetup("setupRoutes");
			expect(imports.Logger.success).toHaveBeenCalled();

		});
	});
});
