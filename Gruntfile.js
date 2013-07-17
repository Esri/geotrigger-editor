module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      build: {
        src: ['src/leaflet/*.js','src/js/*.js','src/geotrigger-editor.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js','src/scss/*.scss'],
        tasks: ['compass','jshint','concat','uglify'],
        options: {
          nospawn: true
        }
      }
    },
    compass: {
      // Production
      dist: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css',
          environment: 'production'
        }
      },
      // Development
      dev: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css'
        }
      }
    },
    jshint: {
      files: ['src/*.js']
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['src/leaflet/*.js','src/js/*.js','src/geotrigger-editor.js'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    complexity: {
      generic: {
        src: ['src/**/*.js', 'tasks/grunt-complexity.js'],
        options: {
          //jsLintXML: 'report.xml', // create XML JSLint-like report
          //checkstyleXML: 'checkstyle.xml', // create checkstyle report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 3,
          halstead: 8,
          maintainability: 100
        }
      }
    },
    cucumberjs: {
      files: 'features',
      options: {
        steps: 'features/step_definitions',
        format: 'pretty'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-cucumber');

  // Default task(s).
  grunt.registerTask('default', ['jshint','concat','uglify']);
  // grunt.registerTask('default', 'complexity');
  // grunt.registerTask('default', ['cucumberjs']);
};