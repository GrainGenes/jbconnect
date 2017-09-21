/**
 * generate api.rst 
 * concats the files in genapi-rst dir.
 */
var fs = require('fs-extra');
var replaceall = require('replaceall');

var dirpath = './genapi-rst/';
var outfile = './api.rst';

var ignore = ['conf.py','index.rst','readme.md'];

// remove api.rst file
if (fs.existsSync(outfile))
    fs.unlinkSync(outfile);

console.log('generating api.rst...');

// main title
fs.appendFileSync(outfile,'***\nAPI\n***\n\n');

// scan through each file in directory
fs.readdirSync(dirpath).forEach(file => {

    if (ignore.indexOf(file) == -1) {  // if file is not in ignore list

        var array = fs.readFileSync(dirpath+file).toString().split("\n");
        
        processFile(array,file);
        //process.exit(1);
    }
});
/**
 * 
 * @param {type} array
 * @returns {undefined}
 */
function processFile(lines,file) {
    // remove the first line - above title
    lines.splice(0,1);
    
    // change the title level of the first line 
    lines[1] = replaceall('=','*',lines[1]);
    
    // skip file if "##excludedoc" is found
    for (i in lines) {
        if (lines[i].indexOf("##excludedoc") > -1) {
            console.log("..ignoring --",file);
            return;
        }
    }
    
    console.log("appending --",file);
    for(i in lines) {
        // remove "Children" section
        if (lines[i].indexOf("Children") > -1) {
            lines.splice(i,6);
        }
        //console.log(lines[i]);
        
        fs.appendFileSync(outfile,lines[i]+'\n');
    }
}
