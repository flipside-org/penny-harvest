module.exports = function(grunt) {
  grunt.initConfig({
    // https://github.com/gruntjs/grunt-contrib-clean
    clean : ['public/assets/styles/*', '!public/assets/**/.gitkeep', 'public/assets/scripts/*', '_site/*'],
    
    // https://github.com/gruntjs/grunt-contrib-compass
    compass : {
      // Default options.
      options : {
          sassDir : 'src/styles',
          cssDir : 'public/assets/styles',
          raw : 'add_import_path "src/bower_components/foundation/scss"'
      },
      
      dev : {
        options : {
          environment: 'development',
          outputStyle: 'expanded',
          debugInfo : true
        }
      },
      prod : {
        options : {
          environment: 'production',
          outputStyle: 'compressed',
        }
      }
    },
        
    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      // Default options.
      options : {
        unused : true
      },
      
      dev : {
        options : {
          force : true
        },
        src : ['src/scripts/**.js']
      },
      
      prod: ['src/scripts/**.js']
    },
    
    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      prod: {
        files: {
          'public/assets/scripts/website.min.js': ['src/scripts/*.js'],
          'public/assets/scripts/media.min.js': [
            'src/bower_components/modernizr/modernizr.js',
          ],
          
          'public/assets/scripts/foundation.min.js': [
            'src/bower_components/foundation/js/vendor/jquery.js',
            
            'src/bower_components/foundation/js/foundation/foundation.js',
            //'src/bower_components/foundation/js/foundation/foundation.abide.js',
            //'src/bower_components/foundation/js/foundation/foundation.accordion.js',
            //'src/bower_components/foundation/js/foundation/foundation.clearing.js',
            //'src/bower_components/foundation/js/foundation/foundation.dropdown.js',
            //'src/bower_components/foundation/js/foundation/foundation.interchange.js',
            //'src/bower_components/foundation/js/foundation/foundation.joyride.js',
            //'src/bower_components/foundation/js/foundation/foundation.magellan.js',
            //'src/bower_components/foundation/js/foundation/foundation.offcanvas.js',
            //'src/bower_components/foundation/js/foundation/foundation.orbit.js',
            //'src/bower_components/foundation/js/foundation/foundation.reveal.js',
            //'src/bower_components/foundation/js/foundation/foundation.tab.js',
            //'src/bower_components/foundation/js/foundation/foundation.tooltips.js',
            //'src/bower_components/foundation/js/foundation/foundation.topbar.js'
          ]
        }
      }
    },
    
    // https://npmjs.org/package/grunt-contrib-watch
    watch : {
      src: {
        files: ['src/scripts/**.js', 'src/styles/**.scss'],
        tasks: ['build']
      },
      jekyll : {
        files: ['public/**/*.html', 'public/**/*.json', 'public/**/*.geojson', 'public/**/*.yml', '!_site/**/*', 'public/**/**/*.md'],
        tasks: ['jekyll:generate']
      }
    },
    
    // https://github.com/dannygarcia/grunt-jekyll
    jekyll : {
      generate : {
        options : {
          config: '_config.yml',
          src: 'public',
          dest: './_site',
        }
      },
      server : {
        options : {
          config: '_config.yml',
          src: 'public',
          dest: './_site',
          serve: true
        }
      }
    }
    
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jekyll');
  
  // Register tasks.
  grunt.registerTask('build', ['compass:dev', 'jshint:dev', 'uglify', 'jekyll:generate']);

  grunt.registerTask('default', ['build', 'watch']);
  
  grunt.registerTask('prod', ['clean', 'compass:prod', 'jshint:prod', 'uglify']);
  
  grunt.registerTask('jk', ['jekyll:server']);

};
