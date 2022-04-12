/*
==================================================================
noledger.io
Server-Side Code Copyright © 2022 noledger
Author: B0-B (alch3mist94@protonmail.com)
------------------------------------------------------------------


==================================================================
*/


var express = require('express'); 
var fs = require('fs'); 
var path = require('path'); 
var https = require('https');
const bodyParser = require('body-parser'); 
const { exec } = require('child_process');

const firewall = require('./modules/firewall.js')
const traffic = require('./modules/traffic.js')


var node = function () {

    /* Main noledger node object */

    this.dir = path.join(__dirname, '/');
    
    this.id_high = 0;                                           // track current ID
    this.id_low = 0;
    
    this.ledger = this.createLedger();                          // create a new ledger object
        
    //this.ledger = {};                                         // initialize ledger object

    this.lifetime = 60;                                         // message lifetime in the ledger in minutes
    this.port = null;                                           // port on which to start the node (is provided by run() method)
    
    this.server = this.build();                                 // build the express server                         

}

node.prototype.build = function () {

    // define api paths
    var api = express();
    var _node = this;
    api.use(express.static(this.dir));
    api.get('/', async function(request, response){
        /* FIREWALL */
        result = await firewall(request);
        if (result) {
            response.redirect('./landing');
        }
    });
    api.get('/client', async function(request, response){

        /* FIREWALL */
        console.log('client request ...')
        result = await firewall(request);
        if (result) {
            /* -- code here */
            response.redirect('/client');
        }
    });
    api.use(bodyParser.json());
    api.post('/ledger', async function(request, response){
        
        // establish an empty response package
        let response_pkg = {collection: [], id_high: null, errors: []}
        
        try {

            /* FIREWALL */
            let result = await firewall(request),
                upperBound = _node.id_high;
            
            if (result) {

                // check if the result is not empty
                _keys = Object.keys(_node.ledger)
                if (Object.keys(_node.ledger).length > 0) {
                    
                    // extract package body
                    const json = result.body

                    // define iteration bounds based on request
                    let lowerBound;
                    
                    // 
                    if (json.id < _node.id_low) {
                        lowerBound = _node.id_low;
                    } else {
                        lowerBound = json.id;
                    }

                    // collect all ledger entries between decided bounds
                    let collected = [];
                    for (let i = lowerBound; i <= upperBound; i++) {
                        const msg = _node.ledger[`${i}`];
                        collected.push(msg);
                    }

                    // append to pkg
                    response_pkg.id_high = upperBound + 1;
                    response_pkg.collection = collected;
                } else {
                    response_pkg.id_high = upperBound;
                }
            } else {
                response_pkg.errors.push('Your request was blocked by the server.')
            }
        } catch (error) {
            console.log('submit error:', error)
        } finally {
            response.send(response_pkg)
        }
        
    });
    api.use(bodyParser.json());
    api.post('/submit', async function (request, response) {

        let response_pkg = {data: [], errors: []}
        try {
            /* FIREWALL */
            result = await firewall(request);
            if (result) {
                /* -- code here */
                const json = request.body;
                //console.log('request', json);

                // override the timestep
                json.time = new Date().getTime();

                // append to ledger
                _node.id_high += 1;
                _node.ledger[`${_node.id_high}`] = json;
                
                //_node.ledger.push(json)
            }
        } catch (error) {
            console.log('submit error:', error)
            response_pkg.errors.push(error)
        } finally {
            response.send(response_pkg)
        }
    });

    // wrap https server
    let certPath = './cert/self_signed/'
    let privateKey  = fs.readFileSync(certPath + 'ssl.key', 'utf8'),
        certificate = fs.readFileSync(certPath + 'ssl.crt', 'utf8');
    let server = https.createServer({
        key: privateKey,
        cert: certificate
    }, api);

    return server
}

node.prototype.createLedger = function (maxBins=1024) {

    /* A function which creates the ledger object depending on maximum bins */

    var ledger = {
        size: 0,                                                // size in bytes 
        structSize: 0,                                          // object empty structure size in bytes 
        group: {}                                               // group object
    };

    for (let i = 0; i < maxBins; i++) {
        ledger.group[i] = {}                                    // every group will have a ledger stack
    }

    ledger.structSize = traffic.estimateSize(this.ledger)       // estimate vanilla structure size

    return ledger
    
}

node.prototype.cleaner = async function () {

    /* 
    Removes old messages from the ledger and updates all necessary parameters. 
    */
    
    console.log('start cleaner ...')
    const ms2min = 1/60000;
    while (this.server) {
        let changes = false,
            currentTime = new Date().getTime(),
            keys = Object.keys(this.ledger).sort((a, b) => a - b);
        if (keys.length > 0) {
            console.log(keys)
            const firstKey = keys[0];
            const firstVal = this.ledger[firstKey];
            const timeDiffInMin = (currentTime - firstVal.time)*ms2min;
            if (timeDiffInMin - this.lifetime > 0) {
                console.log(`delete message [id ${firstKey}]`)
                // delete the message if exceeds allowed lifetime
                delete this.ledger[firstKey];
                changes = true;
            }
        }
        if (!changes) {
            // define new bottom id
            this.id_low = this.id_high - Object.keys(this.ledger).length;
            await this.sleep(5);
        }
    }
    console.log('stopped cleaner.')
}

node.prototype.run = async function (port) {
    try {
        this.cleaner();
        this.port = port;
        this.server.listen(port, () => {
            console.log(`noledger node running at https://localhost:${port}`);
        });
    } catch (error) {
        console.log('Error - terminate\n');
        this.server = null;
        throw error
    } finally {
        //
    }
}

node.prototype.sleep = function (seconds) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(0);
        }, 1000*seconds);
    });
}

// ------------------------------------
// Instantiate the node
// ------------------------------------
const args = process.argv.slice(2);
const srv = new node();
if (args.length == 0) {
    srv.run(443)
} else {
    srv.run(args[0])
}