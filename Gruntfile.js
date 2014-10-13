"use strict";

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg   : grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> built: <%= grunt.template.today('yyyy-mm-dd') %> */\n"
			},
			build  : {
				src : "./core/app/**/*.js",
				dest: "./_BUILD/<%= pkg.name.toLowerCase() %>.min.js"
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Default task(s).
	grunt.registerTask("default", ["uglify"]);

};