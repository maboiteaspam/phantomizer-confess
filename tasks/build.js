'use strict';

module.exports = function(grunt) {

  var fs = require("fs");

  var childProcess = require('child_process');
  var phantomjs = require('phantomjs');
  var ph_libutil = require("phantomizer-libutil");

  grunt.registerMultiTask("phantomizer-confess", "Measure page loading times", function () {

    var options = this.options({
      web_server_paths:[],
      in_request:'',
      host:'localhost',
      port:'',
      ssl_port:'',
      web_server_log:false,
      inject_assets:true,
      action:'performance'
    });

    var in_request = options.in_request;
    var web_server_paths = options.web_server_paths;
    var host = options.host;
    var port = options.port?options.port:"";
    var ssl_port = options.ssl_port?options.ssl_port:"";
    var action = options.action;
    var inject_assets = options.inject_assets;


    var done = this.async();
    var finish = function(stderr,stdout){
      if( stderr != "" ){
        grunt.log.warn( "phantomjs error" );
        grunt.log.warn( stderr );
      } else {
        grunt.log.writeln(stdout);
      }
      done();
    }

    var target_url = in_request;
    if( in_request.match(/^http/) == null ){
// get phantomizer main instance
      var phantomizer = ph_libutil.get("main");

      phantomizer.create_webserver(web_server_paths,function(webserver){
        webserver.enable_dashboard(false);
        webserver.enable_build(false);
        webserver.enable_assets_inject(inject_assets);

        webserver.start(port, ssl_port, host);

        in_request = in_request.substring(1)=="/"?in_request:"/"+in_request;
        target_url = "http://"+host+(port?":"+port:port)+in_request;
        grunt.log.ok("Running "+target_url);
        run_confess(target_url, action, function(stderr,stdout){
          if(webserver.stop){
            webserver.stop(function(stderr,stdout){
              finish();
            });
          }
        });
      });
    }else{
      run_confess(in_request,action,finish);
    }
  });

  function run_confess(target_url,action,then){
    var childArgs = [
      __dirname+'/../vendors/confess.js',
      target_url,
      action,
      __dirname+'/../vendors/config.json'
    ]

    childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
      if(then) then(stderr,stdout);
    })
  }
};