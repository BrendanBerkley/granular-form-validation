module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> - ' +
							'<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
			},
			dist: {
				src: [
					'src/initialize.js', 
					'src/validate.js', 
					'src/placeErrors.js'
				],
				dest: 'dist/<%= pkg.name %>.js',
			},
		},
		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: ['concat'],
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat']);
};