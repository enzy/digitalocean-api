module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jsdoc : {
			dist : {
				src: ['lib/*.js'],
				options: {
					destination: 'docs',
					private: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-jsdoc');

	// Default task(s).
	grunt.registerTask('default', ['jsdoc']);

};