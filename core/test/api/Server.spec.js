"use strict";
var imports = {
		Logger: require("../../api/util/Logger")
	},
	privates = {
	};

ddescribe("Server", function () {
	describe("init", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "setLogLevel");
		});

		it("should initialise the server", function () {

		});
	});
});
