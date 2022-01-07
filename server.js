var express = require('express'); 
var fs = require('fs'); 
var path = require('path'); 
var https = require('https');
const firewall = require('./modules/firewall.js')
const bodyParser = require('body-parser'); 
const { errorMonitor } = require('stream');

var node = function () {
    this.dir = path.join(__dirname, '/');
    this.ledger = [];
    this.lifetime = .2;
    this.port = null;
    this.server = this.build();
}

node.prototype.build = function () {

    // define api paths
    var api = express();
    var _node = this;
    api.use(express.static(this.dir));
    api.get('/', function(request, response){
        /* FIREWALL */
        response.sendFile('index.html');
    });
    api.get('/client', async function(request, response){

        /* FIREWALL */
        console.log('client request ...')
        result = await firewall(request);
        if (result) {
            /* -- code here */
            response.redirect('./client');
            response.send('./client/index.html')
        }
    });
    api.get('/ledger', async function(request, response){

        /* FIREWALL */
        console.log('client request ...')
        result = await firewall(request);
        if (result) {
            /* -- code here */
            response.redirect('./client');
            response.send('./client/index.html')
        }
    });
    api.use(bodyParser.json());
    api.post('/submit', async function (request, response) {

        /* FIREWALL */
        let response_pkg = {data: [], errors: []}
        try {
            console.log('client request ...')
            result = await firewall(request);
            if (result) {
                /* -- code here */
                const json = request.body;
                console.log('request', json);

                // override the timestep
                json.time = new Date().getTime();

                // append to ledger
                _node.ledger.push(json)
            }
        } catch (error) {
            console.log('submit error:', error)
            response_pkg.errors
        } finally {
            response.send(response_pkg)
        }
        
    });


    // wrap https server
    let privateKey  = fs.readFileSync('./cert/ssl.key', 'utf8'),
        certificate = fs.readFileSync('./cert/ssl.crt', 'utf8');
    let server = https.createServer({
        key: privateKey,
        cert: certificate
    }, api);

    return server
}

node.prototype.cleaner = async function () {
    /* Removes old messages from the ledger */
    console.log('start cleaner ...')
    const ms2min = 1/60000;
    while (this.server) {
        let changes = false,
            currentTime = new Date().getTime();
        if (this.ledger.length > 0) {
            const timeDiffInMin = (currentTime - this.ledger[0].time)*ms2min;
            console.log('delta t', timeDiffInMin, '/', this.lifetime, this.ledger)
            let delta = timeDiffInMin-this.lifetime;
            console.log('delta', delta)
            if (timeDiffInMin-this.lifetime > 0) {
                console.log('delete message')
                // delete the message if exceeds allowed lifetime
                delete this.ledger[0];
                this.ledger = this.ledger.slice(1);
                changes = true;
            }
        }
        if (!changes) {
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


async function start () {
    const srv = new node();
    await srv.sleep(1);
    srv.run(3000)
}

start()