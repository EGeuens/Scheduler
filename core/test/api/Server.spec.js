"use strict";
var imports = {
		Logger      : require("../../api/util/Logger"),
		Environments: require("../../api/enum/Environments"),
		Config      : require("../../api/Config"),
		Server      : require("../../api/Server")
	},
	privates = {
		appInstance : null,
		httpInstance: null,
		ioInstance  : null
	};

ddescribe("Server", function () {
	beforeEach(function () {
		imports.Config.environment = imports.Environments.TEST;
	});

	describe("init", function () {
		beforeEach(function () {
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
});
