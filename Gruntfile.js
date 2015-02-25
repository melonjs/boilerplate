module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['lib/melonJS-<%= pkg.version %>.js', 'lib/plugins/*.js', 'js/game.js', 'build/js/resources.js', 'js/**/*.js'],
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
          src: 'manifest.json',
          dest: 'build/manifest.json'
        },{
          src: 'package.json',
          dest: 'build/package.json'
        },{
          src: 'data/**/*',
          dest: 'build/'
        }]
      }
    },
    clean: {
      app: ['build/js/app.js'],
      dist: ['build/','bin/'],
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
    resources: {
      dist: {
        options: {
          dest: 'build/js/resources.js',
          varname: 'game.resources',
        },
        files: [{
          src: ['data/bgm/**/*', 'data/sfx/**/*'],
          type: 'audio'
        },{
          src: ['data/img/**/*.png'],
          type: 'image'
        },{
          src: ['data/img/**/*.json'],
          type: 'json'
        },{
          src: ['data/map/**/*'],
          type: 'tmx'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-download-atom-shell');
  grunt.loadNpmTasks('grunt-asar');

  // Custom Tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['resources', 'concat', 'uglify', 'copy', 'processhtml', 'clean:app']);
  grunt.registerTask('dist', ['default', 'download-atom-shell', 'asar']);
}
