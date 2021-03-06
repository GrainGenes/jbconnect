/*
 * sails bootstrap for mocha
 * 
 *  "scripts": {
 *    "test": "mocha test/bootstrap/bootstrap.test.js...
 */

sails = require('sails');
const shell = require('shelljs');
const _ = require("lodash");
//const async = require("async");
const jblib = require('../../api/services/jbutillib');
const fs = require('fs-extra')


before(function(done) {
    console.log("Lifting SAILS...");

    this.timeout(60000);

    shell.exec('./jbutil --force --dbreset');

    let params = {

        // configuration for testing purposes
        // If you want to use a different DB for testing, uncomment these and replace with your own DB info.
        
        connections: {
          // Replace the following with whatever suits you.
            localDb: {
              adapter: 'sails-disk',
              filePath: 'test/data/'
            },
            testMysql: {
              adapter   : 'sails-mysql',
              host      : 'localhost',
              port      : 3306,
              user      : 'mySQLUser',
              password  : 'MyAwesomePassword',
              database  : 'testDB'
            }
        },

        models: {
          connection: 'localDb',
          migrate: 'drop'
        }
        ,
        policies: {
            '*': true
        }
            
    }; 
    
    params = {};
    
//    console.log("Using DB test/data/localDb.db");
    if (shell.cp('test/data/localDiskDb.db','test/data/localDb.db').code !== 0) {
      shell.echo('error copying test database');
      shell.exit(1);
    }
    sails.lift(params, function(err) {
        if (err) return done(err);

        // here you can load fixtures, etc.
        setTimeout(function() {
            console.log(">>>post timeout",typeof done);

            const g = jblib.getMergedConfig();
            const dataset = 'sample_data/json/volvox';
            //const file = g.jbrowsePath+dataset+'/trackList.json';
            const file = g.jbrowsePath+dataset+'/jbconnect-tracks.json';

            let config = JSON.parse(fs.readFileSync(file,'utf8'));
            let tracks = config.tracks;
            let updatedTracks = [];

            for(var i in tracks) {
                if ( (tracks[i].category && tracks[i].category==='JBConnectTest') || (tracks[i].testtrack && tracks[i].testtrack===true)) {}
                else updatedTracks.push(tracks[i]);
            }
            config.tracks = updatedTracks;
            fs.writeFileSync(file,JSON.stringify(config,null,2));

            Track.Sync(function() {
                done();
            });
        },2000);
    });
});

after(function(done) {
    console.log('after');
    
    lowerSails();

    function lowerSails() {
        console.log("Lowering SAILS...");
        sails.lower(function() {
            console.log("done lowering sails.");
                setTimeout(function() {
                    done();
                    process.exit(0);  // not sure why this is needed.
                },2000);
        });
    }
});
