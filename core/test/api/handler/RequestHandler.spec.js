"use strict";
var imports = {
		RequestHandler: require("../../../api/handler/RequestHandler")
	},
	privates = {
		RequestHandler: new imports.RequestHandler(),
		fileTesterUrl : "/article/25.json",
		apiTesterUrl  : "/api/article/25",
		apiTesterUrlAsHandled  : "/article/25"
	};

describe("RequestHandler.", function () {
	describe("handle", function () {
		it("should pass an /api/... request to the ApiHandler", function () {
			var lApiHandler = privates.RequestHandler.getApiHandler();

			spyOn(lApiHandler, "handle");
			privates.RequestHandler.handle(privates.apiTesterUrl);
			expect(lApiHandler.handle).toHaveBeenCalledWith(privates.apiTesterUrlAsHandled);
		});
		it("should pass an not-/api/... request to the FileHandler", function () {
			var lFileHandler = privates.RequestHandler.getFileHandler();

			spyOn(lFileHandler, "handle");
			privates.RequestHandler.handle(privates.fileTesterUrl);
			expect(lFileHandler.handle).toHaveBeenCalledWith(privates.fileTesterUrl);
		});
		it("should pass to only one other handler", function () {
			var lApiHandler = privates.RequestHandler.getApiHandler(),
				lFileHandler = privates.RequestHandler.getFileHandler();

			spyOn(lApiHandler, "handle");
			spyOn(lFileHandler, "handle");

			privates.RequestHandler.handle(privates.apiTesterUrl);
			expect(lApiHandler.handle).toHaveBeenCalledWith(privates.apiTesterUrlAsHandled);
			expect(lFileHandler.handle).not.toHaveBeenCalled();

			lApiHandler.handle.reset(); // reset the call count of the api handler

			privates.RequestHandler.handle(privates.fileTesterUrl);
			expect(lApiHandler.handle).not.toHaveBeenCalled();
			expect(lFileHandler.handle).toHaveBeenCalledWith(privates.fileTesterUrl);
		});
	});
});
