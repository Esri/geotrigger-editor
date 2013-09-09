module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      dev: {
        options: {
          port: 8080,
          base: '.'
        }
      },
      test: {
        options: {
          port: 8081,
          base: '.'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      dist: {
        src: [
          'js/lib/*.js',
          'js/app.js',
          'src/js/modules/*.js',
          'src/js/controllers/*.js',
          'src/js/models/*.js',
          'src/js/collections/*.js',
          'src/js/layouts/*.js',
          'src/js/views/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: [
          'src/js/**/*.js',
          'src/scss/**/*.scss',
          'src/img/**/*.jpg',
          'src/img/**/*.png',
          'src/templates/**/*.hbs'
        ],
        tasks: [
          'jshint',
          'clean:dev',
          'compass:dev',
          'copy:dev',
          'handlebars',
          'concat:dev'
        ]
        // options: {
        //   nospawn: true
        // }
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
          cssDir: 'dev/css'
        }
      }
    },

    jshint: {
      options: {
        'browser': true,
        'curly': true,
        'eqnull': true,
        'evil': true,
        'expr': true,
        'multistr': true,
        'trailing': true,
        'undef': false,
        'wsh': true,
        'sub': true,
        'boss': true
      },
      files: ['src/js/**/*.js']
    },

    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n\n'
      },
      dev: {
        files: {
          'dev/js/vendor.js': [
            'vendor/json2.js',
            'vendor/jquery-1.10.2.js',
            'vendor/underscore.js',
            'vendor/backbone.js',
            'vendor/backbone.marionette.js',
            'vendor/handlebars.js',
            'vendor/geotriggers.js',
            'vendor/leaflet.js',
            'vendor/esri-leaflet.js',
            'vendor/leaflet.draw-custom.js',
            'vendor/leaflet.draw.tooltip.js'
          ],
          'dev/js/<%= pkg.name %>.js': [
            'src/js/lib/*.js',
            'src/js/app.js',
            'src/templates/*.js',
            'src/js/modules/*.js',
            'src/js/controllers/*.js',
            'src/js/models/*.js',
            'src/js/collections/*.js',
            'src/js/layouts/*.js',
            'src/js/views/*.js'
          ]
        }
      },
      // production
      dist: {
        // the files to concatenate
        src: [
          'src/js/lib/*.js',
          'src/js/app.js',
          'src/templates/*.js',
          'src/js/modules/*.js',
          'src/js/controllers/*.js',
          'src/js/models/*.js',
          'src/js/collections/*.js',
          'src/js/layouts/*.js',
          'src/js/views/*.js'
        ],
        // the location of the resulting JS file
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    complexity: {
      generic: {
        src: [
          'src/js/**/*.js',
          'tasks/grunt-complexity.js'
        ],
        options: {
          // jsLintXML: 'report.xml', // create XML JSLint-like report
          // checkstyleXML: 'checkstyle.xml', // create checkstyle report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 10,
          halstead: 30,
          maintainability: 80
        }
      }
    },

    cucumberjs: {
      files: 'features',
      options: {
        steps: 'features/step_definitions',
        format: 'pretty'
      }
    },

    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'img/**'
          ],
          dest: 'dev/'
        }]
      }
    },

    clean: {
      dist: {
        src: [
          'dist/img/',
          'dist/css/',
          'dist/js/'
        ]
      },
      dev: {
        src: [
          'dev/img/',
          'dev/css/',
          'dev/js/'
        ]
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'GeotriggerEditor.Templates',
          processName: function(filePath) {
            var process = filePath.split('src/templates/')[1];
            return process.split('.hbs')[0];
          }
        },
        files: {
          'src/templates/compiled.js': 'src/templates/*.hbs'
        }
      }
    },

    smushit: {
      // filter by filetype
      dist: {
        src: [
          'src/img/**/*.png',
          'src/img/**/*.jpg'
        ],
        dest: 'dist/img'
      }
    }
  });

  // load npm tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Tasks
  grunt.registerTask('test', [
    'connect:test',
    'jshint',
    'complexity',
    'cucumberjs'
  ]);

  grunt.registerTask('dev', [
    'jshint',
    'clean:dev',
    'compass:dev',
    'copy:dev',
    'handlebars',
    'concat:dev',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'test',
    'clean:dist',
    'compass:dist',
    'handlebars',
    'concat:dist',
    'uglify:dist',
    'smushit'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};