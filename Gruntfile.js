module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['lib/melonJS-<%= pkg.version %>.js', 'lib/plugins/*.js', 'js/game.js', 'js/resources.js','js/**/*.js'],
        dest: 'build/js/app.js'
      }
    },
    copy: {
      dist: {
        files: [{
          src: 'index.css',
          dest: 'build/index.css'
        },{
          src: 'data/**/*',
          dest: 'build/'
        }]
      }
    },
    processhtml: {
      dist: {
        options: {
          process: true,
          data: {
            title: 'My app',
            message: 'This is production distribution'
          }
        },
        files: {
          'build/index.html': ['index.html']
        }
      }
    },
    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/js/app.min.js': [
            'build/js/app.js'
          ]
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.registerTask('default', ['concat', 'uglify', 'copy', 'processhtml']);
}