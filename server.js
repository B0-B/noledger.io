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
const traffic = require('./modules/traffic.js');


var node = function () {

    /* Main noledger node object */

    this.dir = path.join(__dirname, '/');
    
    this.ledger = this.createLedger();                          // create a new ledger object
    this.map = {}                                               // object which maps entry IDs to corr. group

    this.lifetime = 60;                                         // message lifetime in the ledger in minutes
    this.port = null;                                           // port on which to start the node (is provided by run() method)
    
    this.server = this.build();                                 // build the express server
    
    this.requests = 0;                                          // no. of attempts
    this.connections = 0;                                       // total no. of requests to the client
    this.messages = 0;                                          // trace the number of messages
    this.stream = 0;
    this.traffic = 0;
    this.userTrafficLimit = 10**6                               // traffic limit per user
    this.trafficLoad = 0;

}

node.prototype.build = function () {

    // define api paths
    var api = express();
    var _node = this;
    api.use(express.static(this.dir));
    api.get('/', async function(request, response){

        _node.requests += 1

        /* FIREWALL */
        result = await firewall(request);
        if (result) {
            response.redirect('./landing');
        }
    });
    api.get('/client', async function(request, response){

        _node.requests += 1

        /* FIREWALL */
        console.log('client request ...')
        result = await firewall(request);
        if (result) {
            _node.connections += 1;
            response.redirect('/client');
        }
    });
    api.use(bodyParser.json());
    api.post('/ledger', async function(request, response){
        
        // establish an empty response package
        let response_pkg = {collection: [], id_high: null, bins: _node.ledger.bins, errors: []}
        
        try {

            /* FIREWALL */
            if (await firewall(request)) {

                // extract package body
                const json = request.body;

                // determine group to which to assign pkg to
                const group = json.group;

                // check if the format is proper
                if (group >= _node.ledger.bins) {
                    console.log(`provided group "${group}" exceeds current highest bin (group id) which is ${_node.ledger.bins}!`)
                    throw Error(`provided group "${group}" exceeds current highest bin (group id) which is ${_node.ledger.bins}!`)
                }

                // from the group ID get the correct stack from the ledger
                const stack = _node.ledger.group[group];

                /* set the group id to the highest observed global id_glob in the ledger. 
                This will assure that the next request from the same client will ask for
                entries with maxid+1 so future packages. */
                if (_node.ledger.maxid == null) { // ledger is empty
                    response_pkg.id_high = 0;
                } else {
                    response_pkg.id_high = _node.ledger.maxid + 1;
                }
                
                // proceed with collecting entries within requested id bound if the group stack is non-empty
                if (stack && !Object.keys(stack).length == 0) {

                    // get an array of ids contained in the group stack
                    const stackIdArray = Array.from(Object.keys(stack));

                    // determine from which id to start from
                    let lowerBound;
                    if (json.id < _node.ledger.minid) {

                        /* if the last observed id (sent by json pkg) is smaller than
                        the smallest id in the entire ledger, it is outdated. Best one may
                        assume is to take the smallest id known in the group stack.
                        The lower bound becomes an infimum.*/
                        lowerBound = stackIdArray[0];
                    
                    } else if (json.id > _node.ledger.maxid) {
                        // lower bound cannot be determined
                        lowerBound = null;
                    } else {

                        /* Provided json id is still served */
                        lowerBound = json.id;

                    }

                    if (lowerBound) {
                        // find the index in the keys array of stack obj
                        const lowerBoundIndex = stackIdArray.indexOf(lowerBound);

                        /* the desired collection equals the slice starting from the lower bound index.
                        Add it to the response package. */
                        response_pkg.collection = Array.from(Object.values(stack)).slice(lowerBoundIndex);
                        console.log("highest id", response_pkg.id_high)
                    } else {
                        /* if the requested index is higher than the highest index in the ledger 
                        -> the client is up to date and an empty collection is sent */
                        response_pkg.collection = []
                    }
                    
                }

            } else {

                response_pkg.errors.push('Your request was blocked by the server.')

            }

        } catch (error) {

            console.log('ledger request error:', error)

        } finally {

            response.send(response_pkg)

        }
        
    });
    api.use(bodyParser.json());
    api.post('/submit', async function (request, response) {

        let response_pkg = {data: [], errors: []}
        try {

            /* FIREWALL */
            if (await firewall(request)) {

                /* directly raise the maxid in the ledger
                to save the id and space from other requests for the current message.
                The maxid is only raised in case of definition, otherwise define as 0 to initialize the first entry*/
                if (_node.ledger.maxid) {
                    _node.ledger.maxid += 1
                } else {
                    _node.ledger.maxid = 0
                }
                
                const reservedEntryId = _node.ledger.maxid;

                // extract the package body
                const json = request.body;

                // determine group id
                const groupId = json.group;

                // append message to ledger group stack
                _node.ledger.group[groupId][reservedEntryId] = json;

                /* add mapping from ledger entry ID to group ID, this will make it very easy for the cleaner 
                to collect messages chronically starting from lowest id. */
                _node.map[reservedEntryId] = groupId;

                // update the traffic load for the traffic listener
                _node.trafficLoad += await traffic.estimateSize(json);

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
        bins: 1,                                                // start with a single group
        structSize: 0,                                          // object empty structure size in bytes 
        maxid: null,
        minid: 0,
        map: {},                                                // map ledger entry ID to group ID
        group: {}                                               // group object
    };

    // greate group streams
    for (let i = 0; i < maxBins; i++) {
        ledger.group[i] = {}                                    // every group will have a ledger stack
    }

    ledger.structSize = traffic.estimateSize(ledger)            // estimate vanilla structure size

    return ledger

}

node.prototype.cleaner = async function () {

    /* 
    Removes old messages from the ledger and updates all necessary parameters. 
    */
    
    console.log('start cleaner ...')

    const ms2min = 1/60000;
    const delayInSeconds = 10;

    while (this.server) {

        try {

            if (this.ledger.maxid) {

                // draw current timestamp once for reference
                const currentTimestamp = new Date().getTime();

                // iterate from lowest id known in the ledger
                for (let i = this.ledger.minid; i <= this.ledger.maxid; i++) {

                    // use mapping to get group and entry id
                    const entryId = i;
                    const groupId = this.map[entryId];
                    const group = this.ledger.group[groupId];
                    
                    // draw entry from ledger group stack
                    const entry = group[entryId];

                    // compute the entry's age in minutes
                    const age = (currentTimestamp - entry.time) * ms2min;

                    if (age >= this.lifetime) {

                        console.log(`delete message [id ${firstKey}] in group ${groupId}`)

                        // remove message from group stack
                        delete group[entryId];

                        // remove ID from map
                        delete this.map[entryId];

                    } else {

                        // exit here, save the current index as new minimum
                        this.ledger.minid = entryId;

                        /* The map is mighty as it allows to stop checking entries by respecting the chronic.
                        If an entry's age associated with an id "i" does not exceed the lifetime then all later entries with id > i
                        won't either. This allows to skip the loop over these IDs. */
                        break

                    }
                }

            }
            
        } catch (e) {
        
            console.log(e)
        
        } finally {

            await this.sleep(5)
        
        }
        // let changes = false,
        //     currentTime = new Date().getTime(),
        //     keys = Object.keys(this.ledger).sort((a, b) => a - b);
        // if (keys.length > 0) {
        //     console.log(keys)
        //     const firstKey = keys[0];
        //     const firstVal = this.ledger[firstKey];
        //     const timeDiffInMin = (currentTime - firstVal.time)*ms2min;
        //     if (timeDiffInMin - this.lifetime > 0) {
        //         console.log(`delete message [id ${firstKey}]`)
        //         // delete the message if exceeds allowed lifetime
        //         delete this.ledger[firstKey];
        //         changes = true;
        //     }
        // }
        // if (!changes) {
        //     // define new bottom id
        //     this.id_low = this.id_high - Object.keys(this.ledger).length;
        //     await this.sleep(5);
        // }

        await this.sleep(delayInSeconds);
    }
    console.log('stopped cleaner.')
}

node.prototype.run = async function (port) {
    try {
        this.cleaner();
        this.screenTraffic();
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

node.prototype.screenTraffic = async function () {
    
    /* 
    This method uses the traffic module to determine the current
    traffic parameters, aiming to adjust the current bins size.
    */

    const T = 5; // sec period
    const N = 20; // time window for EMA
    
    while(this.server) {

        try {
            
            // estimate current ledger size by subtracting the initial size (when empty) as this is the data amount users have to download
            this.ledger.size = (traffic.estimateSize(this.ledger)-this.ledger.structSize);

            // update the number of messages
            this.messages = this.ledger.maxid - this.ledger.minid;

            // update current stream by recent load gathered within a period in B/s
            const load = this.trafficLoad;
            this.trafficLoad = 0;
            const newStreamValue = load/T;
            console.log('new stream', load, newStreamValue);
            
            this.stream = await traffic.updateStream(newStreamValue, this.stream, N);

            // try to estimate bins
            const lowerBound = await traffic.estimateBinLowerBound(this.stream, this.userTrafficLimit);
            console.log('lower bound',this.stream, this.userTrafficLimit, lowerBound);
            this.ledger.bins = await traffic.base(lowerBound);

            var output = `---------- Traffic Analysis ----------\n`;
            output += `Total Requests:\t${this.requests}\n`;
            output += `Total Valid Connections:\t${this.connections}\n`;
            output += `Current Ledger Size:\t${this.ledger.size} Bytes\n`;
            output += `Current Messages:\t${this.messages}\n`;
            output += `Stream Traffic:\t${this.stream} Bytes/s\n`;
            output += `Group Bins:\t${this.ledger.bins}\n`;
            output += '---------------------------------------'
            console.log(output)

        } catch (error) {

            console.log(error)

        } finally {

            await this.sleep(T)

        }
    }
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