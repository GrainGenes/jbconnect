const tlib = require('../share/test-lib');
const chai = require('chai')
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = 'http://localhost:1337';
const expect = chai.expect;
const assert = chai.assert;

describe('integration test', function(){
    this.timeout(25000);
    it('login', function(done) {
        
        //let app = sails.hooks.http.app;
        agent = chai.request.agent(server);

        agent
          .post('/auth/local?next=/jbrowse')
          .set('content-type', 'application/x-www-form-urlencoded; application/json; charset=utf-8')
          .send({
              'identifier':'juser',
              'password':'password',
              'submit':'login'
          })
          .type('form')
          .end((err,res,body) => {
                expect(res).to.have.status(200);
        
                agent
                  .get('/loginstate')
                  .set('content-type','application/json; charset=utf-8')
                  .end((err,res,body) => {
                     console.log('/loginstate body',res.body);
                     expect(res).to.have.status(200, '/loginstate status 200');
                     expect(res.body.loginstate).to.equal(true, 'login state true');
                     expect(res.body.user.username).to.equal('juser','login username is juser');

                     done();
                  });
          });
    });
    it('get_workflows api',function(done) {
        agent
            .get('/service/exec/get_workflows')
            .set('content-type','application/json; charset=utf-8')
            .end((err,res,body) => {
                expect(res).to.have.status(200, 'get_blastdata api status 200');
                let data = res.body;
                console.log("return data: ",data);
                expect(data[0].id).to.equal('NCBI.blast.workflow.js','id[0] is not NCBI.blast.workflow.js');
                expect(data[1].id).to.equal('Sim.blast.workflow.js','id[1] is Sim.blast.workflow.js');
                done();
            });
    });
    it('get_blastdata api',function(done) {
        agent
            .get('/service/exec/get_blastdata?asset=jblast_sample&dataset=sample_data/json/volvox')
            .set('content-type','application/json; charset=utf-8')
            .end((err,res,body) => {
                expect(res).to.have.status(200, 'get_blastdata api status 200');
                let data = res.body;
                console.log("return data: ",data);
                expect(data.result).to.equal('success',"result is not 'success'");
                expect(data.hits).to.equal(792,'number of hits is not 792');
                done();
            });
    });
    it('get_trackdata api',function(done) {
        agent
            .get('/service/exec/get_trackdata?asset=jblast_sample&dataset=sample_data/json/volvox')
            .set('content-type','text/plain; charset=utf-8')
            .end((err,res,body) => {
                expect(res).to.have.status(200, 'get_trackdata status 200');
                console.log("return data: ",res.text);
                done();
            });
    });
    it('lookup_accession api',function(done) {
        agent
            .get('/service/exec/lookup_accession/?accession=L08874')
            .end((err,res,body) => {
                expect(res).to.have.status(200, '/lookup_accession status 200');
                console.log("return data: ",res.body);
                done();
            });
    });
    it('get_hit_details api',function(done) {
        agent
            .get('/service/exec/get_hit_details/?asset=jblast_sample&dataset=sample_data/json/volvox&hitkey=gi-310775-gb-L08874-1-SYNPHSCSKV-1')
            .end((err,res,body) => {
                expect(res).to.have.status(200, '/lookup_accession status 200');
                let data = res.body;

                console.log("return data: ",data);
                expect(data).to.not.be.undefined;
                expect(data['gi-310775-gb-L08874-1-SYNPHSCSKV-1']).to.not.be.undefined;
                let hit = data['gi-310775-gb-L08874-1-SYNPHSCSKV-1'];
                expect(hit.Hit_num).to.equal('4',"Hit_num is 4");
                expect(hit.Hit_def).to.equal('PhageScript SK cloning vector',"Hit_def is 'PhageScript SK cloning vector'");
                expect(hit.Hit_len).to.equal('7372',"Hit_len is 7372");
                done();
            });
    });
    it('set_filter api', function(done) {
        
        agent
          .post('/service/exec/set_filter')
          .send({
              filterParams: { score: { val: '513' }},
              asset: 'jblast_sample',
              dataset: 'sample_data/json/volvox'
          })
          .end((err,res,body) => {
            expect(res).to.have.status(200, '/lookup_accession status 200');
            console.log("return data: ",res.body);
            done();
          });
    });
    it('submit blast', function(done) {
        
        agent
          .post('/job/submit')
          .send({
              'service': 'jblast',
              'dataset':'sample_data/json/volvox',
              'region': '>ctgA ctgA:23755..25049 length=1295\ntcccatagcccgccgaccgggtctgactcaactgtgttttcgctatcccaggctagcacttctattctttgttacgtc\ncagtcatagtgttactatagggtaattttagtcatagtagacggccgctttttcgtatggcccgagaccgtccaccgg\nctacccaattaagtcacatccggatcttgggtctagatattcctatcgaaaatagtctcgccgcctcactgcgtagtt\ncagggggcgtcacacttgttcgcggcttttcctcatgggatctttacccgatggttgatgcaataaatgtctacaccg\ngactggcgtgtccgagacgactttatacacgtgtgacgagtagatcagatcgtacgaatggtctgtctcacctatccc\nagtgggaggatggaaaacactcctgcctaccgggtcgaattatttacgcgtgttacaatatgtaatttagaaaaaggg\nattgctggtcgatgcgtctccaagggattttttatctaaaagcatccttttgggtgtactctgatcgcacgtcgcaga\ncagcagtgggttttgacgcagtccgtaggcccacagactcgtttgttgtttattaatcccaggggagcgttgaagcca\ncacctattctgtagctgtttgaaaggtagctagcccggatattactcaaggtgactcccttcagaatcacacgtcgct\nggagtcgccacagggtggcatatacgagtgatagagcaccttactttcgaggtagcggtacattagtgcaacgatgaa\ncccactatagtcttagtgatttcatgttttacttacgcgaaaacgtggggttttgtcaacacgtatacgttgaatgca\ncatgcctcatcctaaactgatgcactgccacaagtctgaaagagcgacagtctgcaacatagcggaaggttacgccca\nagccagtggtgatcccccataagcttggagggactccccttagcgttggatgtctttgccccagcggcctcggtgtac\ngggttctccaccccactatggtttggaactatgaagaggtacggcaacctacccgaggcaccaaatcgtgaacctacg\ncctatatatacggatagcagggtatccattcttaccatgagctcgtaaaccactccgctgaattcgatgggctttggc\ngcacatcaccgtttctatcacagatctgtcaacggaatctaacgctatttactcggcgcacacagatcggaaaaccca\nactgtggcgcgggacggactccaggaatcgttacgcgttatcacctt',
              'workflow':'NCBI.blast.workflow.js'
          })
          .end((err,res,body) => {
                console.log('/job/submit status',res.status);
                expect(res).to.have.status(200);
                console.log('/job/submit body',res.body);
                let jobId = res.body.jobId;
                console.log("Job id=",jobId);
                
                tlib.waitForJobComplete(jobId,function(complete,data){
                    
                    expect(complete).to.equal(true);
                    expect(data.state).to.equal('complete','job completed');
                    
                    let trackLabel = data.data.track.label;
                    
                    done();
                    // expect(trackLabel).to.equal("NOTHING_"+jobId);
                    
                    // agent.get("/track/get?lkey="+trackLabel)
                    //   .set('content-type','application/json; charset=utf-8')
                    //   .end((err,res,body) => {
                    //       let trackData = res.body[0];
                    //       let trackLabelShould = 'NOTHING_'+jobId;
                    //       console.log("track data",trackData);
                          
                    //       expect(res).to.have.status(200,'/track/get status 200');
                    //       expect(trackData.trackData.nothing).to.equal(true,'the track nothing field must be true');
                    //       expect(trackData.trackData.label).to.equal(trackLabelShould,'track label confirmed '+trackLabelShould);
                    //       expect(trackData.lkey).to.equal(trackLabelShould,'track label confirmed '+trackLabelShould);

                    //       done();
                    //  });
                    
                });
          });
    });
});