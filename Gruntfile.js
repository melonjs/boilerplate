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
          src: 'main.js',
          dest: 'build/main.js'
        },{
          src: 'package.json',
          dest: 'build/package.json'
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
            title: '<%= pkg.name %>',
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
    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true
        }
      }
    },
    'download-atom-shell': {
      version: '0.21.2',
      outputDir: 'bin'
    },
    asar: {
      app: {
        cwd: 'build',
        src: ['**/*', '!js/app.js'],
        expand: true,
        dest: 'bin/' + (
          process.platform === 'darwin'
            ? 'Atom.app/Contents/Resources/'
            : 'resources/'
        ) + 'app.asar'
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-download-atom-shell');
  grunt.loadNpmTasks('grunt-asar');

  grunt.registerTask('default', ['concat', 'uglify', 'copy', 'processhtml']);
  grunt.registerTask('dist', ['default', 'download-atom-shell', 'asar']);
}
