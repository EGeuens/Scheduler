"use strict";
var imports = {
	Validator: require("../../../api/util/Validator"),
	User     : require("../../../api/model/User")
};

describe("Validator", function () {
	describe("checkType", function () {
		it("should correctly assert a Number", function () {
			var lType = Number,
				lValue = 123,
				lWrongValue = "test",
				lResult;

			lResult = imports.Validator.checkType(lValue, lType);
			expect(lResult).toBe(true);

			lResult = imports.Validator.checkType(lWrongValue, lType);
			expect(lResult).toBe(false);
		});

		it("should correctly assert a String", function () {
			var lType = String,
				lValue = "test",
				lWrongValue = 123,
				lResult;

			lResult = imports.Validator.checkType(lValue, lType);
			expect(lResult).toBe(true);

			lResult = imports.Validator.checkType(lWrongValue, lType);
			expect(lResult).toBe(false);
		});

		it("should pass types it does not know", function () {
			var lType = Array,
				lValue = [],
				lWrongValue = 123,
				lResult;

			lResult = imports.Validator.checkType(lValue, lType);
			expect(lResult).toBe(true);

			lResult = imports.Validator.checkType(lWrongValue, lType);
			expect(lResult).toBe(true);
		});
	});

	describe("validateModel", function () {
		it("should return true for a valid model", function () {
			var lUser = new imports.User({
					_id: 123,
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				}),
				lResult,
				lExpectedUser = new imports.User({
					_id: 123,
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				});

			lResult = imports.Validator.validateModel(lUser, lUser.getModelDefinition());
			expect(lResult).toBe(true);

			expect(lUser.getId()).toBe(lExpectedUser.getId());
			expect(lUser.getName()).toBe(lExpectedUser.getName());
			expect(lUser.getFirstName()).toBe(lExpectedUser.getFirstName());
			expect(lUser.getUsername()).toBe(lExpectedUser.getUsername());
			expect(lUser.getEmail()).toBe(lExpectedUser.getEmail());
		});

		it("should return false for an empty model", function () {
			var lUser = new imports.User(),
				lResult;

			lResult = imports.Validator.validateModel(lUser, lUser.getModelDefinition());
			expect(lResult).toBe(false);
		});

		it("should return false for an invalid model", function () {
			var lUser = new imports.User({
					_id: "aString",
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				}),
				lResult;

			lResult = imports.Validator.validateModel(lUser, lUser.getModelDefinition());
			expect(lResult).toBe(false);
		});
	});

	describe("validateProperty", function () {
		it("should return true if no validations are set", function () {
			var lValue = "anything",
				lProperty = { type: String, default: "" },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(true);
		});

		it("should return true for when validation is set as a non-Array type", function () {
			var lValue = "anything",
				lProperty = { type: String, default: "", validate: "required" },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(true);
		});

		it("should return true when a value is not required and empty", function () {
			var lValue = "",
				lProperty = { type: String, default: "", validate: ["alphabetic"] },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(true);
		});

		it("should return true when a value is not required and null", function () {
			var lValue = null,
				lProperty = { type: String, default: "", validate: ["alphabetic"] },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(true);
		});

		it("should return false when a value is not of the specified type", function () {
			var lValue = "anything",
				lProperty = { type: Number, default: "", validate: ["alphabetic"] },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(false);
		});

		it("should return true when a value matches a know validation type", function () {
			var lValue = "anything",
				lProperty = { type: String, default: "", validate: ["alphabetic"] },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(true);
		});

		it("should return false when a value does not match a know validation type", function () {
			var lValue = 123,
				lProperty = { type: String, default: "", validate: ["alphabetic"] },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(false);
		});

		it("should return false when the validation does not match a know validation type and it is not set on the property", function () {
			var lValue = "anything",
				lProperty = { type: String, default: "", validate: ["you_do_not_know_this"] },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(false);
		});

		it("should return false when the validation does not match a know validation type and it is set on the property but doesn't match", function () {
			var lValue = "anything",
			//																			matches e.g. BE 456.456.456
				lProperty = { type: String, default: "", validate: ["vat_no_be"], vat_no_be: new RegExp("BE\\s\\d{3}\\.\\d{3}\\.\\d{3}", "i") },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(false);
		});

		it("should return true when the validation does not match a know validation type and it is set on the property and matches", function () {
			var lValue = "BE 456.456.456",
			//																			matches e.g. BE 456.456.456
				lProperty = { type: String, default: "", validate: ["vat_no_be"], vat_no_be: new RegExp("BE\\s\\d{3}\\.\\d{3}\\.\\d{3}", "i") },
				lResult;

			lResult = imports.Validator.validateProperty(lValue, lProperty);
			expect(lResult).toBe(true);
		});
	});
});
