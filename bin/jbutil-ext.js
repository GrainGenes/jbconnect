#!/usr/bin/env node

var jblib = require('../api/services/jbutillib');

module.exports = {
    getOptions: function() {
        return [
            //['' , 'setupindex'       , '(JBServer) setup index.html and plugins']
        ];        
    },
    getHelpText: function() {
        return "";
        
    },
    process: function(opt,path,config) {
        //console.log("extended jbutil", opt,path);
        
        this.config = config;
        //util.init(config);
        
        if (!this.init(config)) {
            console.log("jbutil failed to initialize");
            return;
        }
        
        var tool = opt.options['setupindex'];
        if (typeof tool !== 'undefined') {
            jblib.exec_setupindex(this.config);
            jblib.exec_setupPlugins(this.config);
        }
        
    },
    init: function(config) {
        //console.log("config",config);
        /*
         * get values for --gpath, apikey and gurl; grab from saved globals if necessary
         */
        this.gurl = config.galaxy.galaxyUrl;
        this.gpath = config.galaxy.galaxyPath;
        this.apikey = config.galaxy.galaxyAPIKey;
        return 1; // successful init
    }
    
};

/**********************************************
 * process commands arguments - implementation
 **********************************************/

