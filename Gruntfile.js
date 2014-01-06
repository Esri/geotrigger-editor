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
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   <%= pkg.homepage %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache 2.0 License */\n\n',
        report: 'gzip',
        enclose: {}
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': [
            'src/js/app.js',
            'src/templates/compiled.js',
            'src/js/lib/*.js',
            'src/js/modules/*.js',
            'src/js/controllers/*.js',
            'src/js/models/*.js',
            'src/js/views/*.js'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'src/js/controllers/*.js',
          'src/js/models/*.js',
          'src/js/modules/*.js',
          'src/js/views/*.js',
          'src/js/app.js',
          'src/scss/**/*.scss',
          'src/img/**/*.jpg',
          'src/img/**/*.png',
          'src/templates/**/*.hbs'
        ],
        tasks: [
          'jshint',
          'clean:dev',
          'compass:dev',
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
      distmin: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css',
          environment: 'production'
        }
      },
      dist: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css',
          noLineComments: true
        }
      },
      // Development
      dev: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'src/css'
        }
      }
    },

    rename: {
      distmin: {
        src: 'dist/css/geotrigger-editor.css',
        dest: 'dist/css/geotrigger-editor.min.css'
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
      files: [
        'src/js/controllers/*.js',
        'src/js/models/*.js',
        'src/js/modules/*.js',
        'src/js/views/*.js',
        'src/js/app.js'
      ]
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   <%= pkg.homepage %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache 2.0 License */\n\n',
        // define a string to put between each file in the concatenated output
        separator: '\n\n'
      },
      dev: {
        files: {
          'src/js/geotrigger-editor.js': [
            'src/js/header.js',
            'src/js/app.js',
            'src/templates/compiled.js',
            'src/js/lib/*.js',
            'src/js/modules/*.js',
            'src/js/controllers/*.js',
            'src/js/models/*.js',
            'src/js/views/*.js',
            'src/js/footer.js'
          ]
        }
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.js': [
            'src/js/header.js',
            'src/js/app.js',
            'src/templates/compiled.js',
            'src/js/lib/*.js',
            'src/js/modules/*.js',
            'src/js/controllers/*.js',
            'src/js/models/*.js',
            'src/js/views/*.js',
            'src/js/footer.js'
          ]
        }
      }
    },

    complexity: {
      generic: {
        src: [
          'src/js/controllers/*.js',
          'src/js/models/*.js',
          'src/js/modules/*.js',
          'src/js/views/*.js',
          'src/js/app.js',
          'tasks/grunt-complexity.js'
        ],
        options: {
          // jsLintXML: 'report.xml', // create XML JSLint-like report
          // checkstyleXML: 'checkstyle.xml', // create checkstyle report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 15,
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

    clean: {
      dist: {
        src: [
          'dist/css/',
          'dist/js/'
        ]
      },
      img: {
        src: [
          'dist/img/'
        ]
      },
      dev: {
        src: [
          'src/css/geotrigger-editor.css',
          'src/js/geotrigger-editor.js'
        ]
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'GeotriggerEditor.Templates',
          processContent: function(content, filepath) {
            content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
            content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
            return content;
          },
          processName: function(filePath) {
            console.log(filePath);
            var process = filePath.split('src/templates/')[1];
            return process.split('.hbs')[0];
          }
        },
        files: {
          'src/templates/compiled.js': 'src/templates/**/*.hbs'
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
    },

    jsbeautifier: {
      verify: {
        files: {
          src: [
            'src/js/**/*.js', '!src/js/lib/*.*', '!src/js/geotrigger-editor.js',
            'src/templates/*.hbs'
          ]
        },
        options : {
          mode: 'VERIFY_ONLY',
          html: {
            fileTypes: ['.hbs'],
            braceStyle: 'collapse',
            indentChar: ' ',
            indentScripts: 'keep',
            indentSize: 2,
            maxPreserveNewlines: 2,
            preserveNewlines: true,
            unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'span', 'strong', 'em'],
            wrapLineLength: 0
          },
          js: {
            braceStyle: 'collapse',
            breakChainedMethods: false,
            e4x: false,
            evalCode: false,
            indentChar: " ",
            indentLevel: 0,
            indentSize: 2,
            indentWithTabs: false,
            jslintHappy: true,
            keepArrayIndentation: false,
            keepFunctionIndentation: false,
            maxPreserveNewlines: 2,
            preserveNewlines: true,
            spaceBeforeConditional: true,
            spaceInParen: false,
            unescapeStrings: false,
            wrapLineLength: 0
          }
        },
      },
      format: {
        files: {
          src: [
            'src/js/**/*.js', '!src/js/lib/*.*', '!src/js/geotrigger-editor.js',
            'src/templates/*.hbs'
          ]
        },
        options: {
          mode: 'VERIFY_AND_WRITE',
          html: {
            fileTypes: ['.hbs'],
            braceStyle: 'collapse',
            indentChar: ' ',
            indentScripts: 'keep',
            indentSize: 2,
            maxPreserveNewlines: 2,
            preserveNewlines: true,
            unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'span', 'strong', 'em'],
            wrapLineLength: 0
          },
          js: {
            braceStyle: 'collapse',
            breakChainedMethods: false,
            e4x: false,
            evalCode: false,
            indentChar: " ",
            indentLevel: 0,
            indentSize: 2,
            indentWithTabs: false,
            jslintHappy: true,
            keepArrayIndentation: false,
            keepFunctionIndentation: false,
            maxPreserveNewlines: 2,
            preserveNewlines: true,
            spaceBeforeConditional: true,
            spaceInParen: false,
            unescapeStrings: false,
            wrapLineLength: 0
          }
        },
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

  grunt.registerTask('verify', [
    'jshint',
    'complexity',
    'jsbeautifier:verify'
  ]);

  grunt.registerTask('format', [
    'jsbeautifier:format'
  ]);

  grunt.registerTask('dev', [
    'jshint',
    'clean:dev',
    'compass:dev',
    'handlebars',
    'concat:dev',
    'connect:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'build_img',
    'compass:distmin',
    'rename:distmin',
    'compass:dist',
    'handlebars',
    'concat:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('build_img', [
    'clean:img',
    'smushit'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};