var express = require('express'); 
var fs = require('fs'); 
var path = require('path'); 
var https = require('https');
const firewall = require('./modules/firewall.js')
const bodyParser = require('body-parser'); 
const { errorMonitor } = require('stream');

var node = function () {
    this.dir = path.join(__dirname, '/');
    this.port = null;
    this.server = this.build();
}

node.prototype.build = function () {

    // define api paths
    var api = express();
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
        console.log('client request ...')
        result = await firewall(request);
        if (result) {
            /* -- code here */
            const json = request.body;
            console.log('request', json)
            res.send(response_pkg)
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

node.prototype.run = async function (port) {
    try {
        this.port = port;
        this.server.listen(port, () => {
            console.log(`noledger node running at https://localhost:${port}`);
        });
    } catch (error) {
        console.log('Error - terminate\n');
        this.port = null;
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