/*
 * prepare primer3 processing.
 * primer3.prep.js <jobDataFile> <primer3rec>
 */
const fs = require('fs-extra');
const jblib = require('../api/services/jbutillib');
const util = require('./primer3.utils');
//const replaceall = require ('replaceall');

let getopt = require('node-getopt');


let options= [
    ['h','help', 'display this help']
];

let opt = new getopt(options);
opt.parseSystem();
let argv = opt.parsedOption.argv;

console.log('> primer3.prep',argv[0],argv[1]);

try {
    console.log("cwd",process.cwd());
    // insert sequence into primer3 template
    let jobdata = JSON.parse(fs.readFileSync(argv[0], 'utf8'));
    let primer3template = fs.readFileSync('workflows/primer3.template', 'utf8');
    console.log(jobdata);
    //console.log(jobdata.region);
    let seq = util.parseSeqData(jobdata.region);
    let len = util.countSequence(jobdata.region);
    let rangeHigh = len;
    let rangeLow = Math.floor(len * .90);

    console.log('seq',seq);
    primer3template = primer3template.replace('<<seq>>',seq.seqdata);
    primer3template = primer3template.replace('<<range-high>>',rangeHigh);
    primer3template = primer3template.replace('<<range-low>>',rangeLow);

    fs.writeFileSync(argv[1],primer3template);
    process.exit(0);
}
catch(err) {
    console.error(err);
    process.exit(1);
}

// write to tmp/script.file