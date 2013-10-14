'use strict';

module.exports = function(grunt) {

    var fs = require("fs")

    var childProcess = require('child_process');
    var phantomjs = require('phantomjs');
    var http = require('http');
    var ph_libutil = require("phantomizer-libutil");

    grunt.registerMultiTask("phantomizer-confess", "Measure page loading times", function () {

        var webserver = ph_libutil.webserver;

        var router_factory = ph_libutil.router;
        var optimizer_factory = ph_libutil.optimizer;
        var meta_factory = ph_libutil.meta;

        var config = grunt.config.get();
        var meta_manager = new meta_factory(process.cwd(), config.meta_dir)
        var optimizer = new optimizer_factory(meta_manager, config)
        var router = new router_factory(config.routing);

        var done = this.async();
        var finish = function(stderr,stdout){
            if( stderr != "" ){
                console.log( "phantomjs error" );
                console.log( stderr );
            } else {
                console.log(stdout);
            }
            done();
        }

        var options = this.options();
        var in_request = options.in_request;
        var port = options.port;

        var target_url = in_request;
        if( target_url.match(/^http/) == null ){
            router.load(function(){

                target_url = "http://localhost:"+port+in_request;

                var grunt_config = grunt.config.get();
                grunt_config.log = true;
                grunt_config.web_paths = options.paths;
                webserver = new webserver(router,optimizer,meta_manager,process.cwd(), grunt_config);
                webserver.is_phantom(true);
                webserver.enable_dashboard(false);
                webserver.enable_build(false);
                webserver.enable_assets_inject(options.inject_assets);
                webserver.start(options.port, options.ssl_port);

                run_confess(target_url,'performance',finish);
            });

        }else{
            run_confess(target_url,'performance',finish);
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