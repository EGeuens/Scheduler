"use strict";
var imports = {
	Logger: require("../../../api/util/Logger")
},
	privates = {
		initMessage: "Hello init!",
		logLevel: imports.Logger.LOG_LEVEL_DEBUG
	};

describe("Logger", function () {
	describe("init", function () {
		beforeEach(function(){
			spyOn(imports.Logger, "setLogLevel");
			console.log = function(){};
			spyOn(console, "log");
		});

		it("should initialise the logger without params", function () {
			imports.Logger.init();

			expect(console.log.callCount).toBe(1); //initialisation message
			expect(imports.Logger.setLogLevel).toHaveBeenCalled();
		});
		it("should initialise the logger with 1 param and log the message", function () {
			imports.Logger.init(privates.initMessage);

			expect(console.log.callCount).toBe(2); //initialisation message + our message = 2
			expect(imports.Logger.setLogLevel).toHaveBeenCalled();
		});
		it("should initialise the logger with 2 params, log the message and set the log level", function () {
			imports.Logger.init(privates.initMessage, privates.logLevel);

			expect(console.log.callCount).toBe(2); //initialisation message + our message = 2
			expect(imports.Logger.setLogLevel).toHaveBeenCalledWith(privates.logLevel);
		});
	});
});
