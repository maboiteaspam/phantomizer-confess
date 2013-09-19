
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
        }
    });

    grunt.loadNpmTasks('phantomizer-confess');


    grunt.registerTask('default',
        [
            'phantomizer-confess:demo'
        ]);
};
