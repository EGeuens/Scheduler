"use strict";
var imports = {
		FileHandler: require("../../../api/handler/FileHandler"),
		Logger     : require("../../../api/util/Logger"),
		fs         : require("fs")
	},
	privates = {
		rootPath             : "/my_test",
		basePath             : "/somewhere",
		apiTesterUrlAsHandled: "/article/25"
	};

describe("FileHandler.", function () {
	it("should send a file", function () {
		var lFileHandler = new imports.FileHandler(privates.rootPath, privates.basePath),
			lNext = jasmine.createSpy("next"),
			lSendFile = jasmine.createSpy("sendFile");

		lFileHandler({ originalUrl: "/existingFile.txt"}, { sendFile: lSendFile }, lNext);

		spyOn(imports.Logger, "debug");
		spyOn(imports.fs, "exists").andCallFake(function (path, callback) {
			callback(true);
		});
		expect(lNext).not.toHaveBeenCalled();
		expect(imports.fs.exists).toHaveBeenCalled();
		expect(imports.Logger.debug).toHaveBeenCalled();
		expect(lSendFile).toHaveBeenCalled();
	});
});
