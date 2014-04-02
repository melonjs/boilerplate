/*global module:false*/
'use strict';
module.exports = function(grunt) {
  var sourceFiles = [
    'js/game.js',
    'js/resources.js',
    'js/screens/play.js',
  ];

  // Project configuration.
  grunt.initConfig({
    concat: {
      dist: {
        src: sourceFiles,
        dest: 'build/game.js'
      }
    },

    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/game-min.js': [
            sourceFiles
          ]
        }
      }
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },

      beforeConcat: {
        files: {
          src: sourceFiles
        }
      },

      afterConcat: {
        files: {
          src: [ sourceFiles ]
        }
      }
    },

    clean: {
      dist: [
        'build/game.js',
        'build/game-min.js'
      ],
    },

    manifest: {
      generate:{
        options: {
          basePath: '.',
          cache: sourceFiles,
          master: ['index.html']        
        },
        src: sourceFiles + ['index.html', 'index.css', 'data/*', 'lib/*']     
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-manifest');


  // Default task.
  grunt.registerTask('default', ['concat', 'uglify', 'manifest']);
  grunt.registerTask('lint', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat']);
};
