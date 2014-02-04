
module.exports = function(grunt) {

  var d = __dirname+"/vendors/phantomizer-confess";

  var out_dir = d+"/demo/out/";
  var meta_dir = d+"/demo/out/";


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')

    ,port:8080
    ,ssl_port:8081
    ,paths:[d+"/demo/in/"]
    ,"out_dir":out_dir
    ,"meta_dir":meta_dir

    ,'phantomizer-confess': {
      demo: {
        options: {
          in_request:"/"
        }
      }
    },
    docco: {
      debug: {
        src: [
          'tasks/build.js'
        ],
        options: {
          layout:'linear',
          output: 'documentation/'
        }
      }
    },
    'gh-pages': {
      options: {
        base: '.',
        add: true
      },
      src: ['documentation/**']
    },
    release: {
      options: {
        bump: true,
        add: false,
        commit: false,
        npm: false,
        npmtag: true,
        tagName: '<%= version %>',
        github: {
          repo: 'maboiteaspam/phantomizer-confess',
          usernameVar: 'GITHUB_USERNAME',
          passwordVar: 'GITHUB_PASSWORD'
        }
      }
    }
  });

  grunt.loadNpmTasks('phantomizer-confess');
  /*
   grunt.registerTask('default',
   [
   'phantomizer-confess:demo'
   ]);
   */

  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-release');
  grunt.registerTask('cleanup-grunt-temp', [],function(){
    var wrench = require('wrench');
    wrench.rmdirSyncRecursive(__dirname + '/.grunt', !true);
    wrench.rmdirSyncRecursive(__dirname + '/documentation', !true);
  });

  // to generate and publish the docco style documentation
  // execute this
  // grunt
  grunt.registerTask('default', ['docco','gh-pages', 'cleanup-grunt-temp']);

  // to release the project in a new version
  // use one of those commands
  // grunt --no-write -v release # test only
  // grunt release:patch
  // grunt release:minor
  // grunt release:major
  // grunt release:prerelease
};
