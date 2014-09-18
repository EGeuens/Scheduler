"use strict";
var imports = {
	Logger: require("../../../api/util/Logger"),
	User  : require("../../../api/model/User")
};

describe("User model", function () {
	describe("creation with constructor", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "warn");
		});

		it("should initialise the user with default values", function () {
			var lUser = new imports.User();

			expect(imports.Logger.warn).not.toHaveBeenCalled();

			expect(lUser.id).toBe(null);
			expect(lUser.name).toBe("");
			expect(lUser.username).toBe("");
			expect(lUser.email).toBe("");
		});

		it("should set provided values", function () {
			var lUserConf = {
					id      : 123,
					name    : "Test",
					username: "Tester123",
					email   : "123@test.tst"
				},
				lUser = new imports.User(lUserConf);

			expect(imports.Logger.warn).not.toHaveBeenCalled();

			expect(lUser.id).toBe(lUserConf.id);
			expect(lUser.name).toBe(lUserConf.name);
			expect(lUser.username).toBe(lUserConf.username);
			expect(lUser.email).toBe(lUserConf.email);
		});

		it("should log an warning for an invalid property", function () {
			var lUserConf = {
					id                       : 123,
					name                     : "Test",
					username                 : "Tester123",
					email                    : "123@test.tst",
					invalid_property_for_user: false
				},
				lUser = new imports.User(lUserConf);

			expect(imports.Logger.warn).toHaveBeenCalled();

			expect(lUser.id).toBe(lUserConf.id);
			expect(lUser.name).toBe(lUserConf.name);
			expect(lUser.username).toBe(lUserConf.username);
			expect(lUser.email).toBe(lUserConf.email);
			expect(lUser.invalid_property_for_user).toBeUndefined();
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
				lEmail = "tester@123.com";

			lUser.setEmail(lEmail);
			expect(lUser.getEmail()).toBe(lEmail);
		});
	});
});
