/*
            NOLEDGER

        Client-Side Code
*/


var noledger = new Vue({

    el: '#noledger',

    /* ---- Object architecture ----
    contacts
        contact public-key
            in
                msg
                    header
                        from
                        timestamp
                ...
            out
                msg
                    header
                        from
                        timestamp
                msg
                ...
    */
    data: {
        contacts: {},
        encryption: {
            encoder: new TextEncoder(),
            decoder: new TextDecoder(),
            algorithm: {
                name: 'RSA-OAEP',
            },
            length: 4096,
            hash: 'SHA-256'
        },
        keyPair: {}
    },

    mounted: async function () {
        this.keyPair = await this.generateKeyPair();
        testphrase = 'Hello 123 !'
        enc = await this.encrypt(testphrase, this.keyPair.publicKey)
        dec = await this.decrypt(enc)
        console.log(enc)
        console.log(dec)
    },

    methods: {
        encrypt: async function (data, key) {
            const dataEncoded = this.encryption.encoder.encode(data);
            return crypto.subtle.encrypt(this.encryption.algorithm, key, dataEncoded);
        },
        decrypt: async function (cipher) {
            const dataEncoded = await crypto.subtle.decrypt(this.encryption.algorithm, this.keyPair.privateKey, cipher);
            return this.encryption.decoder.decode(dataEncoded);
        },
        keyExport: async function (keyPair) {
            await window.crypto.subtle.exportKey(
                'raw',
                key,
            );
        },
        generateKeyPair: async function () {
            return window.crypto.subtle.generateKey(
                {
                  name: this.encryption.algorithm.name,
                  modulusLength: this.encryption.length,
                  publicExponent: new Uint8Array([1, 0, 1]),
                  hash: this.encryption.hash
                },
                true,
                ["encrypt", "decrypt"]
            );            
        },
        generateNewAccount: async function () {
            console.log("generate new account ...")
            this.keyPair = await this.generateKeyPair();
            // flush wrapper content
            document.getElementById('wrapper').innerHTML="";
        },
        request: function (options, path) {
      
            return new Promise(function (resolve, reject) {
                // setup HTTP request 
                var xhr = new XMLHttpRequest(); 
                console.log('req-json', options)
                xhr.open("POST", path, true); 
                xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
                
                // log response
                xhr.onreadystatechange = function () {  
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var json = JSON.parse(xhr.responseText);
                        if (Object.keys(json).includes('error') && json['error'].length != 0) { // if errors occur
                            console.log('server:', json['error'])
                        } else if (json['info'] != '') { // if an info was left
                            console.log('server:', json['info'])
                        } resolve(json);
                    }
                }
        
                // handle errors
                xhr.onerror = function() {
                    reject({'errors': ['error during request: no connection']})
                }
        
                // send stringed options
                xhr.send(JSON.stringify(options)); 
            });
        },
    }
});