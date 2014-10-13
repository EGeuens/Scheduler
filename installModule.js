"use strict";

////
// Script to install modules
////

var imports = {
		fs          : require("fs"),
		ErrorFactory: require("./core/api/factory/ErrorFactory"),
		Module      : require("./core/api/model/Module"),
		jasmine     : require("jasmine-node")
	},
	privates = {
		args  : process.argv.splice(2),
		module: null,

		jasmineConfig: {
			specFolders      : [],
			onComplete       : null,
			isVerbose        : false,
			showColors       : true,
			teamcity         : false,
			useRequireJs     : false,
			regExpSpec       : /.*\.spec\.js/,
			junitreport      : {
				report        : true,
				savePath      : __dirname + "/reports/",
				useDotNotation: true,
				consolidate   : true
			},
			includeStackTrace: true,
			growl            : false
		},

		readConfig: function () {
			var lModule = privates.args[0];

			if (!lModule) {
				throw imports.ErrorFactory.create("What do you want to install here mister/madam? Module name not supplied.");
			}

			var lModuleConfigFile = __dirname + "\\" + lModule + "\\" + lModule + ".json";

			imports.fs.readFile(lModuleConfigFile, { encoding: "utf8" }, function (err, data) {
				if (err) {
					throw imports.ErrorFactory.create("Module configuration file not found, it should be:", lModuleConfigFile);
				}

				privates.findPreInstalledModules(data);
			});

		},

		findPreInstalledModules: function (data) {
			var lConfig = JSON.parse(data);
			privates.module = new imports.Module(lConfig);

			imports.Module.prototype.find({
				selector: {
					name: privates.module.getName()
				}
			}, function (err, modules) {
				if (err) {
					throw imports.ErrorFactory.create("An error occurred while trying to search for existing modules", err);
				}
				if (modules.length > 1) {
					throw imports.ErrorFactory.create("Found", modules.length, "modules with the same name, what's going on here? :0");
				}

				privates.prepareInstall(modules);
			});
		},

		prepareInstall: function (modules) {
			//prepare installation
			if (modules.length === 1) {
				//make sure _id is set!
				privates.module.setId(modules[0]._id);
			}

			var onJasmineComplete = function (runner) {
				var lTestResults = runner.results();

				if (lTestResults.skipped) {
					console.error("Hold on... You're skipping tests there friend, that's a big no-no!", privates.module.getName(), "will not be installed.");
					return;
				}
				if (lTestResults.failedCount) {
					console.error("Hold on... Your tests are failing!", privates.module.getName(), "will not be installed.");
					return;
				}

				console.log(lTestResults.totalCount, "tests? Nice work! All passed by the way :)");

				//TODO add karma tests here

				console.log("Going ahead and installing the module now.");
				privates.doInstall();
			};

			privates.jasmineConfig.specFolders.push(__dirname + privates.module.rootPath + "/test/api");
			privates.jasmineConfig.onComplete = onJasmineComplete;

			imports.jasmine.executeSpecsInFolder(privates.jasmineConfig);
		},

		doInstall: function () {
			privates.module.save(function (err) {
				if (!err) {
					console.log(privates.module.getName(), "was successfully", privates.module.getId() ? "overwritten!" : "installed!");
				}
				else {
					console.error(err);
				}
			});
		}    };

privates.readConfig();