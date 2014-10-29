"use strict";
var imports = {
	_              : require("underscore"),
	Logger         : require("../../../api/util/Logger"),
	Validator      : require("../../../api/util/Validator"),
	User           : require("../../../api/model/User"),
	DatabaseAdapter: require("../../../api/adapter/DatabaseAdapter"),
	PasswordHash   : require("password-hash")
};

describe("User model", function () {
	var lUserConfig;

	beforeEach(function () {
		lUserConfig = {
			_id      : 123,
			name     : "tester",
			firstName: "tester",
			username : "tester123",
			password : "tester123@!paS$",
			email    : "tester@test.com"
		};
	});

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

	describe("setPassword", function () {
		it("should set the password", function () {
			var lUser = new imports.User(),
				lPassword = lUserConfig.password;

			lUser.setPassword(lPassword);
			expect(imports.PasswordHash.verify(lPassword, lUser.getPassword())).toBe(true);
			expect(imports.PasswordHash.isHashed(lUser.getPassword())).toBe(true);
		});

		it("should not rehash the password", function () {
			var lUser = new imports.User(),
				lPassword = lUserConfig.password,
				lPasswordHash = imports.PasswordHash.generate(lPassword);

			lUser.setPassword(lPasswordHash);

			expect(imports.PasswordHash.verify(lPassword, lUser.getPassword())).toBe(true);
			expect(imports.PasswordHash.isHashed(lUser.getPassword())).toBe(true);
		});
	});

	describe("find (prototype)", function () {
		var lExpected;

		beforeEach(function () {
			spyOn(imports.DatabaseAdapter, "query").andCallFake(function (type, collection, query, cb) {
				expect(typeof type).toBe("string");
				expect(typeof collection).toBe("string");
				expect(typeof query).toBe("object");
				expect(query.selector).toEqual({ _id: lUserConfig._id });

				var lReturn = [], i;
				for (i = 0; i < lExpected.length; i++) {
					lReturn.push(lExpected[i].toModel());
				}
				cb(null, lReturn);
			});
		});

		it("should find an array of users by an id", function () {
			var lConfig = {
					_id: lUserConfig._id
				},
				lUser;

			lExpected = [new imports.User(lUserConfig)];

			imports.User.prototype.find(lConfig, function (err, result) {
				expect(err).toBe(null);
				expect(imports._.isArray(result)).toBe(true);

				lUser = result[0];
				expect(lUser.getId()).toBe(lExpected[0].getId());
				expect(lUser.getName()).toBe(lExpected[0].getName());
				expect(lUser.getFirstName()).toBe(lExpected[0].getFirstName());
				expect(lUser.getUsername()).toBe(lExpected[0].getUsername());
				expect(lUser.getEmail()).toBe(lExpected[0].getEmail());
			});
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
			var lUser = new imports.User(lUserConfig),
				lUserModel = lUser.toModel();

			//remove password hash for simplicity
			delete lUserModel.password;
			delete lUserConfig.password;

			expect(lUserModel).toEqual(lUserConfig);
		});
	});

	describe("method isValidPassword", function () {
		it("should validate a password", function () {
			var lUser = new imports.User(lUserConfig);

			spyOn(imports.User.prototype, "find").andCallFake(function (query, cb) {
				cb(null, [lUser]);
			});

			lUser.isValidPassword(function (err, result) {
				expect(result).toBe(true);
			});
		});

		it("should not validate a different password", function () {
			var lUser = new imports.User(lUserConfig),
				lCbUser;

			lUserConfig.password = "something_different";

			lCbUser = new imports.User(lUserConfig);

			spyOn(imports.User.prototype, "find").andCallFake(function (query, cb) {
				cb(null, lCbUser);
			});

			lUser.isValidPassword(function (err, result) {
				expect(result).toBe(false);
			});
		});
	});
});
