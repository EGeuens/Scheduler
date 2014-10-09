"use strict";
var imports = {
	Logger      : require("../../../api/util/Logger"),
	ModelFactory: require("../../../api/factory/ModelFactory")
};

describe("Error factory", function () {
	var modelDefinition = {
		id       : { type: Number, default: null, validate: ["number"] },
		name     : { type: String, default: "", validate: ["required", "alphabetic"] },
		rootPath : { type: String, default: "", validate: ["required", "alphanumeric"] },
		apiPath  : { type: String, default: "", validate: ["alphanumeric"] },
		publicDir: { type: String, default: "/app", validate: ["alphanumeric"] }
	};
	describe("create", function () {
		it("should create an model constructor", function () {
			var lModel = imports.ModelFactory.create(modelDefinition);

			expect(lModel).not.toBeUndefined();
			expect(lModel).toEqual(jasmine.any(Function));
		});
	});
});
