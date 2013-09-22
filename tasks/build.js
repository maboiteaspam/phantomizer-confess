'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask("phantomizer-confess", "Measure page loading times", function () {

        var fs = require("fs")

        var childProcess = require('child_process');
        var phantomjs = require('phantomjs');
        var http = require('http');
        var connect = require('connect');
        var ph = require("phantomizer");


        var options = this.options();
        var in_request = options.in_request;
        var port = options.port;
        var ssl_port = options.ssl_port;
        var paths = options.paths;

        var webserver = null;
        var target_url = in_request;
        if( target_url.match(/^http/) == null ){
            target_url = "http://localhost:"+port+in_request;

            webserver = ph.webserver;
            var grunt_config = grunt.config.get();
            grunt_config.log = true;
            grunt_config.web_paths = options.paths;
            webserver = new webserver(process.cwd(), grunt_config);
            webserver.is_phantom(true);
            webserver.enable_dashboard(false);
            webserver.enable_build(false);
            webserver.enable_assets_inject(options.inject_assets);
            webserver.start(options.port, options.ssl_port);
        }

        var childArgs = [
            __dirname+'/../vendors/confess.js',
            target_url,
            'performance',
             __dirname+'/../vendors/config.json'
        ]

        var done = this.async();

        childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
            if( stderr != "" ){
                console.log( "phantomjs error" );
                console.log( stderr );
            } else {
                console.log(stdout);
            }
        })
    });

};