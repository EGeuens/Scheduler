"use strict";
var imports = {
		RequestHandler: require("../../../api/handler/RequestHandler")
	},
	privates = {
		fileTesterUrl        : "/article/25.json",
		apiTesterUrl         : "/api/article/25",
		apiTesterUrlAsHandled: "/article/25"
	};

describe("RequestHandler.", function () {
	describe("handle", function () {
		it("should pass an /api/... request to the ApiHandler", function () {
			var lApiHandler = imports.RequestHandler.getApiHandler();

			spyOn(lApiHandler, "handle");
			imports.RequestHandler.handle(privates.apiTesterUrl);
			expect(lApiHandler.handle).toHaveBeenCalledWith(privates.apiTesterUrlAsHandled, undefined);
		});
	});
});
