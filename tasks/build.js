'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask("phantomizer-confess", "Confess page performance", function () {

        var fs = require("fs")

        var childProcess = require('child_process')
        var phantomjs = require('phantomjs')
        var connect = require('connect')


        var options = this.options();
        var in_request = options.in_request;
        var port = options.port;
        var ssl_port = options.ssl_port;
        var paths = options.paths;


        var target_url = "http://localhost:"+port+in_request;

        var app = connect()
        app.use(connect.query())
        app.use(connect.urlencoded())
        if( options.log ){
            app.use(connect.logger('dev'))
        }
        for(var n in paths ){
            app.use(connect.static(paths[n]))
        }
        app.listen(port)
        app.listen(ssl_port)


        var childArgs = [
            __dirname+'/../vendors/confess.js',
            target_url
        ]

        var done = this.async();


        childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {

            app.close();

            if( stderr != "" ){
                console.log( "phantomjs error" );
                console.log( stderr );
                done(false)
            } else {
                console.log(stdout);
            }
        })
    });

};