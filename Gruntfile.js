
module.exports = function(grunt){

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{
			data: grunt.file.readJSON("package.json")
		}
	);

	grunt.initConfig({
		concat: {
			dist: {
				options: {
					banner: banner
				},
				files: {
					"dist/breakpoint.js": ["src/breakpoint.js"]
				}
			}
		},
		uglify: {
			dist: {
				options: {
					banner: banner
				},
				files: {
					"dist/breakpoint.min.js": ["src/breakpoint.js"]
				}
			}
		}
	});

	grunt.registerTask("default", ["concat:dist", "uglify:dist"]);

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

};