"use strict";
var imports = {
	Logger      : require("../../../api/util/Logger"),
	ErrorFactory: require("../../../api/factory/ErrorFactory")
};

describe("Error factory", function () {
	describe("create", function () {
		it("should create an error", function () {
			var lError = imports.ErrorFactory.create();

			expect(lError).not.toBeUndefined();
			expect(lError.message).toBe("");
			expect(lError.stack.indexOf("at ErrorFactory.create")).toBeGreaterThan(-1);
		});

		it("should create an error with a simple message", function () {
			var lErrorMessage = "oops",
				lError = imports.ErrorFactory.create(lErrorMessage);

			expect(lError).not.toBeUndefined();
			expect(lError.message).toBe(lErrorMessage);
			expect(lError.stack.indexOf("at ErrorFactory.create")).toBeGreaterThan(-1);
		});

		it("should create an error with a complex message", function () {
			var lErrorMessageParts = ["oops", "i", "did", "it", "again"],
				lError = imports.ErrorFactory.create(lErrorMessageParts[0], lErrorMessageParts[1], lErrorMessageParts[2], lErrorMessageParts[3], lErrorMessageParts[4]);

			expect(lError).not.toBeUndefined();
			expect(lError.message).toBe(lErrorMessageParts.join(" "));
			expect(lError.stack.indexOf("at ErrorFactory.create")).toBeGreaterThan(-1);
		});
	});
});
