"use strict";
var imports = {
	Logger   : require("../../../api/util/Logger"),
	Validator: require("../../../api/util/Validator"),
	User     : require("../../../api/model/User")
};

describe("User model", function () {
	describe("creation with constructor", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "warn");
		});

		it("should initialise the user with default values", function () {
			var lUser = new imports.User();

			expect(imports.Logger.warn).not.toHaveBeenCalled();

			expect(lUser.getId()).toBe(null);
			expect(lUser.getName()).toBe("");
			expect(lUser.getUsername()).toBe("");
			expect(lUser.getEmail()).toBe("");
		});

		it("should set provided values", function () {
			var lUserConf = {
					_id     : 123,
					name    : "Test",
					username: "Tester123",
					email   : "tester@test.com"
				},
				lUser = new imports.User(lUserConf);

			expect(imports.Logger.warn).not.toHaveBeenCalled();

			expect(lUser.getId()).toBe(lUserConf._id);
			expect(lUser.getName()).toBe(lUserConf.name);
			expect(lUser.getUsername()).toBe(lUserConf.username);
			expect(lUser.getEmail()).toBe(lUserConf.email);
		});

		it("should log a warning for an invalid property", function () {
			var lUserConf = {
					_id            : 123,
					name           : "Test",
					firstName      : "Testerke",
					username       : "Tester123",
					email          : "tester@test.com",
					invalidProperty: false
				},
				lUser = new imports.User(lUserConf);

			expect(imports.Logger.warn).toHaveBeenCalled();

			expect(lUser.getId()).toBe(lUserConf._id);
			expect(lUser.getName()).toBe(lUserConf.name);
			expect(lUser.getFirstName()).toBe(lUserConf.firstName);
			expect(lUser.getUsername()).toBe(lUserConf.username);
			expect(lUser.getEmail()).toBe(lUserConf.email);
			expect(lUser.invalidProperty).toBeUndefined();
		});
	});

	describe("setId", function () {
		it("should set the id", function () {
			var lUser = new imports.User(),
				lId = 999;

			lUser.setId(lId);
			expect(lUser.getId()).toBe(lId);
		});
	});

	describe("setName", function () {
		it("should set the name", function () {
			var lUser = new imports.User(),
				lName = "tester";

			lUser.setName(lName);
			expect(lUser.getName()).toBe(lName);
		});
	});

	describe("setFirstName", function () {
		it("should set the first name", function () {
			var lUser = new imports.User(),
				lName = "tester";

			lUser.setFirstName(lName);
			expect(lUser.getFirstName()).toBe(lName);
		});
	});

	describe("setUsername", function () {
		it("should set the username", function () {
			var lUser = new imports.User(),
				lUsername = "tester123";

			lUser.setUsername(lUsername);
			expect(lUser.getUsername()).toBe(lUsername);
		});
	});

	describe("setEmail", function () {
		it("should set the email address", function () {
			var lUser = new imports.User(),
				lEmail = "tester@test.com";

			lUser.setEmail(lEmail);
			expect(lUser.getEmail()).toBe(lEmail);
		});
	});

	describe("find", function () {
		//TODO
		it("should find a user by an id", function () {
			var lUser = new imports.User({
					_id: 123
				}),
				lExpectedUser = new imports.User({
					_id      : 123,
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				});

			lUser.find();
			expect(lUser.getId()).toBe(lExpectedUser.getId());
			expect(lUser.getName()).toBe(lExpectedUser.getName());
			expect(lUser.getFirstName()).toBe(lExpectedUser.getFirstName());
			expect(lUser.getUsername()).toBe(lExpectedUser.getUsername());
			expect(lUser.getEmail()).toBe(lExpectedUser.getEmail());
		});
	});

	describe("validate", function () {
		it("should return true for a valid model", function () {
			var lUser = new imports.User({
					_id      : 123,
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				}),
				lResult,
				lExpectedUser = new imports.User({
					_id      : 123,
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				});

			spyOn(imports.Validator, "validateModel").andCallFake(function () {
				return true;
			});

			lResult = lUser.validate();
			expect(imports.Validator.validateModel).toHaveBeenCalled();
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

			spyOn(imports.Validator, "validateModel").andCallFake(function () {
				return false;
			});

			lResult = lUser.validate();
			expect(imports.Validator.validateModel).toHaveBeenCalled();
			expect(lResult).toBe(false);
		});

		it("should return false for an invalid model", function () {
			var lUser = new imports.User({
					_id      : "aString",
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				}),
				lResult;

			spyOn(imports.Validator, "validateModel").andCallFake(function () {
				return false;
			});

			lResult = lUser.validate();
			expect(imports.Validator.validateModel).toHaveBeenCalled();
			expect(lResult).toBe(false);
		});
	});

	describe("method toModel", function () {
		it("should return the model", function () {
			var lConf = {
					_id      : 123,
					name     : "tester",
					firstName: "tester",
					username : "tester123",
					email    : "tester@test.com"
				},
				lUser = new imports.User(lConf);

			expect(lUser.toModel()).toEqual(lConf);
		});
	});
});
