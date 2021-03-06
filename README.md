# phantomizer-confess v0.1.x

> Confess support for Phantomizer project

phantomizer-confess is a grunt task specialized
in analyzing loading performance given a Phantomizer project
using Confess tool.


Find out more about Confess

https://github.com/jamesgpearce/confess

Find out more about Phantomizer

http://github.com/maboiteaspam/phantomizer


#### Example config

```javascript
{
  'phantomizer-confess': {         // Task
    confess: {                  // Target
      options: {                 // Target options
            web_server_paths:[], // paths to look for assets, if in_request is relative to your phantomizer project
            in_request:'', // in request
            port:'', // host port, if in_request is relative to your phantomizer project
            ssl_port:'', // ssl host port, if in_request is relative to your phantomizer project
            web_server_log:false, // webserver command line log, if in_request is relative to your phantomizer project
            inject_assets:true, // inject extra assets, if in_request is relative to your phantomizer project
            host:'http://localhost', // host address, if in_request is relative to your phantomizer project
            action:'performance' // Confess action performance|appcache|cssproperties, default: performance
      }
    },
    "index":{
        "options":{
            "in_request":"index.html",
            "action":"appcache"
        }
    },
    "google":{
        "options":{
            "in_request":"http://google.com",
            "action":"performance"
        }
    }
  }
}

```


# Documentation Index

http://maboiteaspam.github.io/phantomizer-confess/

http://maboiteaspam.github.io/phantomizer-confess/documentation/build.html


## Release History


---

