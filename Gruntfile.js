'use strict';

module.exports = function (grunt) {

  var importOnce = require('node-sass-import-once');

    // Project configuration.
    grunt.initConfig({

        clean: {
            css: ['css'],
            bower: ['bower_components'],
            reports: ['reports'],
            test: ['bower_components/test']
        },

        copy: {
            test: {
                files: [
                    {
                        cwd: '',
                        expand: true,
                        src: [
                            '*.html'
                        ],
                        dest: 'bower_components/test'
                    }
                ]
            }
        },

        sass: {
            options: {
                importer: importOnce,
                importOnce: {
                  index: true,
                  bower: true
                }
            },
            card: {
                files: {
                    'css/noprefix/px-card-sketch.css': 'sass/px-card-sketch.scss',
                    'css/noprefix/px-card.css': 'sass/px-card-predix.scss'
                }
            },
            controls: {
                files: {
                    'css/noprefix/px-card-controls-sketch.css': 'sass/px-card-controls-sketch.scss',
                    'css/noprefix/px-card-controls.css': 'sass/px-card-controls-predix.scss'
                }
            },
            header: {
                files: {
                    'css/noprefix/px-card-header-sketch.css': 'sass/px-card-header-sketch.scss',
                    'css/noprefix/px-card-header.css': 'sass/px-card-header-predix.scss'
                }
            },
            demo: {
                files: {
                  'css/noprefix/px-card-demo.css': 'sass/px-card-demo.scss'
                }
            }
        },

        autoprefixer: {
          options: {
            browsers: ['last 2 version']
          },
          multiple_files: {
            expand: true,
            flatten: true,
            src: 'css/noprefix/*.css',
            dest: 'css'
          }
        },

        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            bower: {
                command: 'bower install'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'js/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            htmljs: {
                files: ['*.html', '*.js'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            }
        },

        depserve: {
            options: {
                open: '<%= depserveOpenUrl %>'
            }
        },
        webdriver: {
            options: {
                specFiles: ['test/*spec.js']
            },
            local: {
                webdrivers: ['chrome']
            }
        },
        concurrent: {
            devmode: {
                tasks: ['watch', 'depserve'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        bump: {
          options:{
            files: ['bower.json', 'package.json'],
            updateConfigs: [],
            commitFiles: ['package.json', 'bower.json'],
            push: false
          }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dep-serve');
    grunt.loadNpmTasks('webdriver-support');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-concurrent');

    // Default task.
    grunt.registerTask('default', 'Basic build', [
        'sass',
        'autoprefixer'
    ]);

    grunt.registerTask('devmode', 'Development Mode', [
        'concurrent:devmode'
    ]);

    // First run task.
    grunt.registerTask('firstrun', 'Basic first run', function() {
        grunt.config.set('depserveOpenUrl', '/index.html');
        grunt.task.run('default');
        grunt.task.run('depserve');
    });

    // Default task.
    grunt.registerTask('test', 'Test', [
        'jshint',
        'webdriver'
    ]);

    grunt.registerTask('release', 'Release', [
        'clean',
        'shell:bower',
        'default',
        'test'
    ]);

};
