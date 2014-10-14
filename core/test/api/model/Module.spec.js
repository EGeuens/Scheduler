"use strict";
var imports = {
	_              : require("underscore"),
	Logger         : require("../../../api/util/Logger"),
	Validator      : require("../../../api/util/Validator"),
	Module         : require("../../../api/model/Module"),
	DatabaseAdapter: require("../../../api/adapter/DatabaseAdapter")
};

describe("Module model", function () {
	var lModuleConfig;

	beforeEach(function () {
		lModuleConfig = {
			_id       : {},
			name      : "Test",
			version   : "0.1",
			rootPath  : "/test",
			apiPath   : "/testApi",
			publicPath: "/test/public",
			publicDir : "/tester"
		};
	});

	describe("creation with constructor", function () {
		beforeEach(function () {
			spyOn(imports.Logger, "warn");
		});

		it("should initialise the module with default values", function () {
			var lModule = new imports.Module();

			expect(imports.Logger.warn).not.toHaveBeenCalled();

			expect(lModule.getId()).toBe(null);
			expect(lModule.getName()).toBe("");
			expect(lModule.getVersion()).toBe("");
			expect(lModule.getRootPath()).toBe("");
			expect(lModule.getApiPath()).toBe("");
			expect(lModule.getPublicPath()).toBe("");
			expect(lModule.getPublicDir()).toBe("/app");
		});

		it("should set provided values", function () {
			var lModule = new imports.Module(lModuleConfig);

			expect(imports.Logger.warn).not.toHaveBeenCalled();

			expect(lModule.getId()).toBe(lModuleConfig._id);
			expect(lModule.getName()).toBe(lModuleConfig.name);
			expect(lModule.getVersion()).toBe(lModuleConfig.version);
			expect(lModule.getRootPath()).toBe(lModuleConfig.rootPath);
			expect(lModule.getApiPath()).toBe(lModuleConfig.apiPath);
			expect(lModule.getPublicPath()).toBe(lModuleConfig.publicPath);
			expect(lModule.getPublicDir()).toBe(lModuleConfig.publicDir);
		});

		it("should log a warning for an invalid property", function () {
			var lConf = lModuleConfig,
				lModule;

			lConf.invalidProperty = "";

			lModule = new imports.Module(lConf);

			expect(imports.Logger.warn).toHaveBeenCalled();

			expect(lModule.getId()).toBe(lModuleConfig._id);
			expect(lModule.getName()).toBe(lModuleConfig.name);
			expect(lModule.getVersion()).toBe(lModuleConfig.version);
			expect(lModule.getRootPath()).toBe(lModuleConfig.rootPath);
			expect(lModule.getApiPath()).toBe(lModuleConfig.apiPath);
			expect(lModule.getPublicPath()).toBe(lModuleConfig.publicPath);
			expect(lModule.getPublicDir()).toBe(lModuleConfig.publicDir);
			expect(lModule.invalidProperty).toBeUndefined();
		});
	});

	describe("setId", function () {
		it("should set the id", function () {
			var lModule = new imports.Module(),
				lId = lModuleConfig._id;

			lModule.setId(lId);
			expect(lModule.getId()).toBe(lId);
		});
	});

	describe("setName", function () {
		it("should set the name", function () {
			var lModule = new imports.Module(),
				lName = lModuleConfig.name;

			lModule.setName(lName);
			expect(lModule.getName()).toBe(lName);
		});
	});

	describe("setVersion", function () {
		it("should set the Version", function () {
			var lModule = new imports.Module(),
				lVersion = lModuleConfig.version;

			lModule.setVersion(lVersion);
			expect(lModule.getVersion()).toBe(lVersion);
		});
	});

	describe("setRootPath", function () {
		it("should set the RootPath", function () {
			var lModule = new imports.Module(),
				lRootPath = lModuleConfig.rootPath;

			lModule.setRootPath(lRootPath);
			expect(lModule.getRootPath()).toBe(lRootPath);
		});
	});

	describe("setApiPath", function () {
		it("should set the ApiPath", function () {
			var lModule = new imports.Module(),
				lApiPath = lModuleConfig.apiPath;

			lModule.setApiPath(lApiPath);
			expect(lModule.getApiPath()).toBe(lApiPath);
		});
	});

	describe("setPublicPath", function () {
		it("should set the PublicPath", function () {
			var lModule = new imports.Module(),
				lPublicPath = lModuleConfig.publicPath;

			lModule.setPublicPath(lPublicPath);
			expect(lModule.getPublicPath()).toBe(lPublicPath);
		});
	});

	describe("setPublicDir", function () {
		it("should set the PublicDir", function () {
			var lModule = new imports.Module(),
				lPublicDir = lModuleConfig.publicDir;

			lModule.setPublicDir(lPublicDir);
			expect(lModule.getPublicDir()).toBe(lPublicDir);
		});
	});

	describe("find (prototype)", function () {
		var lExpected;

		beforeEach(function () {
			spyOn(imports.DatabaseAdapter, "query").andCallFake(function (type, collection, query, cb) {
				expect(typeof type).toBe("string");
				expect(typeof collection).toBe("string");
				expect(typeof query).toBe("object");
				expect(query.selector).toEqual({ _id: lModuleConfig._id });

				cb(null, lExpected);
			});
		});

		it("should find a single module", function () {
			var lConfig = {
					_id: lModuleConfig._id
				},
				lModule;

			lExpected = new imports.Module(lModuleConfig);

			imports.Module.prototype.find(lConfig, function (err, result) {
				expect(err).toBe(null);
				expect(imports._.isObject(result)).toBe(true);

				lModule = result;
				expect(lModule.getId()).toBe(lExpected.getId());
				expect(lModule.getName()).toBe(lExpected.getName());
				expect(lModule.getVersion()).toBe(lExpected.getVersion());
				expect(lModule.getRootPath()).toBe(lExpected.getRootPath());
				expect(lModule.getApiPath()).toBe(lExpected.getApiPath());
				expect(lModule.getPublicPath()).toBe(lExpected.getPublicPath());
				expect(lModule.getPublicDir()).toBe(lExpected.getPublicDir());
			});
		});

		it("should find an array of modules", function () {
			var lConfig = {
					_id: lModuleConfig._id
				},
				lModule;

			lExpected = [new imports.Module(lModuleConfig)];

			imports.Module.prototype.find(lConfig, function (err, result) {
				expect(err).toBe(null);
				expect(imports._.isArray(result)).toBe(true);

				lModule = result[0];
				expect(lModule.getId()).toBe(lExpected[0].getId());
				expect(lModule.getName()).toBe(lExpected[0].getName());
				expect(lModule.getVersion()).toBe(lExpected[0].getVersion());
				expect(lModule.getRootPath()).toBe(lExpected[0].getRootPath());
				expect(lModule.getApiPath()).toBe(lExpected[0].getApiPath());
				expect(lModule.getPublicPath()).toBe(lExpected[0].getPublicPath());
				expect(lModule.getPublicDir()).toBe(lExpected[0].getPublicDir());
			});
		});
	});

	describe("method toModel", function () {
		it("should return the model", function () {
			var lModule = new imports.Module(lModuleConfig);

			expect(lModule.toModel()).toEqual(lModuleConfig);
		});
	});
});
