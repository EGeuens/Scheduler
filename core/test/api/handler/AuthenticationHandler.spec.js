"use strict";
var imports = {
	AuthenticationHandler: require("../../../api/handler/AuthenticationHandler"),
	User                 : require("../../../api/model/User"),
	Messages             : require("../../../api/enum/Messages")
};

describe("AuthenticationHandler.", function () {
	var lUsername = "user", lPassword = "pass", lDone,
		lUserConfig = {
			_id     : {},
			username: lUsername
		};

	describe("method localStrategy", function () {
		it("should report an error", function () {
			var lError = "Some error",
				lUser = null;

			spyOn(imports.User.prototype, "find").andCallFake(function (query, cb) {
				cb(lError, lUser);
			});

			lDone = function (err, user, message) {
				expect(err).not.toBe(null);
				expect(err).toBe(lError);
				expect(user).toBeUndefined();
				expect(message).toBeUndefined();
			};

			imports.AuthenticationHandler.localStrategy(lUsername, lPassword, lDone);
		});

		it("should report an unknown user", function () {
			var lError = null,
				lUser = null;

			spyOn(imports.User.prototype, "find").andCallFake(function (query, cb) {
				cb(lError, lUser);
			});

			lDone = function (err, user, message) {
				expect(err).toBe(null);
				expect(user).toBe(false);
				expect(message).toEqual({ message: imports.Messages.UNKNOWN_USER });
			};

			imports.AuthenticationHandler.localStrategy(lUsername, lPassword, lDone);
		});

		it("should report an invalid password", function () {
			var lError = null,
				lUser = new imports.User(lUserConfig);

			spyOn(imports.User.prototype, "find").andCallFake(function (query, cb) {
				expect(query).toEqual({ username: lUsername });
				cb(lError, lUser);
			});
			spyOn(lUser, "isValidPassword").andCallFake(function (cb) {
				cb(null, false);
			});

			lDone = function (err, user, message) {
				expect(err).toBe(null);
				expect(user).toBe(false);
				expect(message).toEqual({ message: imports.Messages.INVALID_PASSWORD });
			};

			imports.AuthenticationHandler.localStrategy(lUsername, lPassword, lDone);
		});

		it("should pass on a valid authentication", function () {
			var lError = null,
				lUser = new imports.User(lUserConfig);

			spyOn(imports.User.prototype, "find").andCallFake(function (query, cb) {
				expect(query).toEqual({ username: lUsername });
				cb(lError, lUser);
			});
			spyOn(lUser, "isValidPassword").andCallFake(function (cb) {
				cb(null, true);
			});

			lDone = function (err, user, message) {
				expect(err).toBe(null);
				expect(user.getId()).toBe(lUser.getId());
				expect(user.getName()).toBe(lUser.getName());
				expect(user.getFirstName()).toBe(lUser.getFirstName());
				expect(user.getUsername()).toBe(lUser.getUsername());
				expect(user.getPassword()).toBe(lUser.getPassword());
				expect(user.getEmail()).toBe(lUser.getEmail());
				expect(message).toBeUndefined();
			};

			imports.AuthenticationHandler.localStrategy(lUsername, lPassword, lDone);
		});
	});
});
