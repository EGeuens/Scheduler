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
		beforeEach(function () {
			spyOn(imports.Logger, "setLogLevel");
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

	describe("setLogLevel", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "error");
			spyOn(imports.Logger, "info");
			spyOn(console, "log");
		});

		it("should set the level to LOG_LEVEL_NONE without params", function () {
			imports.Logger.setLogLevel();

			expect(imports.Logger.error).toHaveBeenCalled();
			expect(imports.Logger.info).toHaveBeenCalled();
			expect(imports.Logger.getLogLevel()).toBe(imports.Logger.LOG_LEVEL_NONE);
		});

		it("should set the level to LOG_LEVEL_NONE with faulty params", function () {
			imports.Logger.setLogLevel(5642313);

			expect(imports.Logger.error).toHaveBeenCalled();
			expect(imports.Logger.info).toHaveBeenCalled();
			expect(imports.Logger.getLogLevel()).toBe(imports.Logger.LOG_LEVEL_NONE);
		});

		it("should set the level to LOG_LEVEL_DEBUG", function () {
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_DEBUG);

			expect(imports.Logger.info).toHaveBeenCalled();
			expect(imports.Logger.getLogLevel()).toBe(imports.Logger.LOG_LEVEL_DEBUG);
		});

		it("should set the level to LOG_LEVEL_INFO", function () {
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_INFO);

			expect(imports.Logger.info).toHaveBeenCalled();
			expect(imports.Logger.getLogLevel()).toBe(imports.Logger.LOG_LEVEL_INFO);
		});

		it("should set the level to LOG_LEVEL_ERROR", function () {
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_ERROR);

			expect(imports.Logger.info).toHaveBeenCalled();
			expect(imports.Logger.getLogLevel()).toBe(imports.Logger.LOG_LEVEL_ERROR);
		});
	});

	describe("log", function () {
		beforeEach(function () {
			spyOn(console, "log");
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_TEST);
		});

		it("should call console.log with specified parameter (color: black)", function () {
			var lText = "Hello";
			imports.Logger.log(lText);

			expect(console.log).toHaveBeenCalledWith(["[LOG]", lText].join(" ").black);
		});

		it("should call console.log with specified parameters (multiple) joined by a space (color: black)", function () {
			var lText = "Hello", lText2 = "Test";
			imports.Logger.log(lText, lText2);

			expect(console.log).toHaveBeenCalledWith(["[LOG]", lText, lText2].join(" ").black);
		});
	});

	describe("info", function () {
		beforeEach(function () {
			console.log = function () {};
			spyOn(console, "log");
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_TEST);
		});

		it("should call console.log with specified parameter (color: blue)", function () {
			var lText = "Hello";
			imports.Logger.info(lText);

			expect(console.log).toHaveBeenCalledWith(["[INFO]", lText].join(" ").blue);
		});

		it("should call console.log with specified parameters (multiple) joined by a space (color: blue)", function () {
			var lText = "Hello", lText2 = "Test";
			imports.Logger.info(lText, lText2);

			expect(console.log).toHaveBeenCalledWith(["[INFO]", lText, lText2].join(" ").blue);
		});
	});

	describe("warn", function () {
		beforeEach(function () {
			spyOn(console, "log");
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_TEST);
		});

		it("should call console.log with specified parameter (color: yellow)", function () {
			var lText = "Hello";
			imports.Logger.warn(lText);

			expect(console.log).toHaveBeenCalledWith(["[WARNING]", lText].join(" ").yellow);
		});

		it("should call console.log with specified parameters (multiple) joined by a space (color: yellow)", function () {
			var lText = "Hello", lText2 = "Test";
			imports.Logger.warn(lText, lText2);

			expect(console.log).toHaveBeenCalledWith(["[WARNING]", lText, lText2].join(" ").yellow);
		});
	});

	describe("error", function () {
		beforeEach(function () {
			spyOn(console, "log");
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_TEST);
		});

		it("should call console.log with specified parameter (color: red)", function () {
			var lText = "Hello";
			imports.Logger.error(lText);

			expect(console.log).toHaveBeenCalledWith(["[ERROR]", lText].join(" ").red);
		});

		it("should call console.log with specified parameters (multiple) joined by a space (color: red)", function () {
			var lText = "Hello", lText2 = "Test";
			imports.Logger.error(lText, lText2);

			expect(console.log).toHaveBeenCalledWith(["[ERROR]", lText, lText2].join(" ").red);
		});
	});

	describe("debug", function () {
		beforeEach(function () {
			spyOn(console, "log");
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_TEST);
		});

		it("should call console.log with specified parameter (color: magenta)", function () {
			var lText = "Hello";
			imports.Logger.debug(lText);

			expect(console.log).toHaveBeenCalledWith(["[DEBUG]", lText].join(" ").magenta);
		});

		it("should call console.log with specified parameters (multiple) joined by a space (color: magenta)", function () {
			var lText = "Hello", lText2 = "Test";
			imports.Logger.debug(lText, lText2);

			expect(console.log).toHaveBeenCalledWith(["[DEBUG]", lText, lText2].join(" ").magenta);
		});
	});

	describe("success", function () {
		beforeEach(function () {
			spyOn(console, "log");
			imports.Logger.setLogLevel(imports.Logger.LOG_LEVEL_TEST);
		});

		it("should call console.log with specified parameter (color: green)", function () {
			var lText = "Hello";
			imports.Logger.success(lText);

			expect(console.log).toHaveBeenCalledWith(["[SUCCESS]", lText].join(" ").green);
		});

		it("should call console.log with specified parameters (multiple) joined by a space (color: green)", function () {
			var lText = "Hello", lText2 = "Test";
			imports.Logger.success(lText, lText2);

			expect(console.log).toHaveBeenCalledWith(["[SUCCESS]", lText, lText2].join(" ").green);
		});
	});
});
