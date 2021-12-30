/*
            NOLEDGER

        Client-Side Code
*/


/* Base64URL encoding/decoding */
function unescape (str) {
    return (str + '==='.slice((str.length + 3) % 4))
        .replace(/-/g, '+')
        .replace(/_/g, '/')
}

function escape (str) {
    return str.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
/**/

/* noledger main object */
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
        chatVisible: false,
        contacts: {},
        encryption: {
            encoder: new TextEncoder(),
            decoder: new TextDecoder(),
            algorithm: {
                name: 'RSA-OAEP',
                hash: {
                    name: 'SHA-256'
                }
            },
            length: 4096,
            hash: 'SHA-256'
        },
        keyPair: {},
        toAddress: '',
        wrapperVisible: true,
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
        backToContacts: async function () {
            this.wrapperVisible = true;
            this.chatVisible = false;
        },
        encrypt: async function (data, key) {
            const dataEncoded = this.encryption.encoder.encode(data);
            return crypto.subtle.encrypt(this.encryption.algorithm, key, dataEncoded);
        },
        decrypt: async function (cipher) {
            const dataEncoded = await crypto.subtle.decrypt(this.encryption.algorithm, this.keyPair.privateKey, cipher);
            return this.encryption.decoder.decode(dataEncoded);
        },
        keyExport: async function (key) {
            
            const exported = window.crypto.subtle.exportKey(
              "jwk",
              key
            );
            console.log('jwk', exported)
            return exported
        
        },
        keyImport: async function (key) {
            // encode the key to base64url
            key_enc = window.btoa(unescape(encodeURIComponent( key )));
            key_enc = key_enc.slice(0,key_enc.length-1)
            //key_enc = escape(key_enc)
            console.log(key, '\n\n', key_enc)
            const imported = window.crypto.subtle.importKey(
                "jwk",
                { 
                    kty: "RSA", 
                    e: "AQAB", 
                    n: key_enc,
                    alg: this.encryption.algorithm.name,
                    ext: true,
                },
                this.encryption.algorithm,
                false,
                ['encrypt']
            )
            return imported
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
            let wrapper = document.getElementById('wrapper');
            wrapper.innerHTML = "";
            // build contacts page
            await this.loadContactsPage();
        },
        getAddress: async function () {
            let pub = await this.keyExport(this.keyPair.publicKey);
            console.log('public',pub)
            return pub.n;
        },
        loadChat: async function (address) {
            console.log('load chat ...')
            if (!(address in this.contacts)) {
                console.log('initialize first contact.')
                this.contacts[address] = {
                    key: this.keyImport(address),
                    from:[],
                    to:[]
                }
            }
            this.toAddress = address;
            this.chatVisible = true;
            this.wrapperVisible = false;
        },
        loadContactsPage: async function () {
            let wrapper = document.getElementById('wrapper');

            // build the self address bar
            let addressHeader = document.createElement('div');
            let address_raw = await this.getAddress();
            address = address_raw.slice(0,9);
            addressHeader.innerHTML = `<div id="generate" class="row no-gutters">
                <h3 id="address">address: ${address}...</h3>
            </div>`;
            wrapper.appendChild(addressHeader);
            el = document.getElementById('address');
            el.zIndex = 0
            el.onmouseover = function () {
                console.log('copied')
                span = document.createElement('span');
                span.id = 'address-tooltip';
                span.innerHTML = 'copy'
                span.zIndex = 100
                this.appendChild(span)
                this.style.outline = "1px solid rgb(51, 77, 148)"
            }
            el.onmouseout = function () {
                document.getElementById('address-tooltip').remove()
                this.style.outline = "0px"
            }
            el.onmousedown = function () {
                navigator.clipboard.writeText(address_raw);
                document.getElementById('address-tooltip').innerHTML = 'copied'
            }

            // create contacts threads
            let contactsWrapper = document.createElement('div');
            contactsWrapper.id = 'contacts-wrapper';
            wrapper.appendChild(contactsWrapper);
            contactsWrapper.className = 'container-fluid p-0';
            for (const address in this.contacts) {
                this.loadNewContactThread(contactsWrapper, address)
            }
            this.loadNewContactButton(contactsWrapper)
            
        },
        loadNewContactButton: async function (parent) {

            let el = document.createElement('span');
            el.className = 'contact-box clickable';
            el_payload = document.createElement('p');
            el_payload.innerHTML = "+ add contact";
            el.onmousedown = function () {
                // create address input
                this.remove();
                let el = document.createElement('span');
                el.className = 'contact-box';
                input_field = document.createElement('input');
                input_field.className = 'input-box';
                input_field.placeholder = 'enter address';
                el.appendChild(input_field);
                parent.appendChild(el);
                // reload contact button on out focus
                input_field.onfocusout = function () {
                    el.remove();
                    console.log('blur');
                    noledger.loadNewContactButton(parent);
                }
                // trigger when address is confirmed via enter
                input_field.onkeydown = function (e) {
                    e = e || window.event;
                    switch (e.keyCode) {
                        case 13 : //Your Code Here (13 is ascii code for 'ENTER')
                            noledger.loadChat(this.value);
                            noledger.loadNewContactThread(document.getElementById('contacts-wrapper'), this.value);
                            //console.log('trigger', this.value);
                    }
                }
            }

            //el.className = "new-contact";
            el.appendChild(el_payload);
            parent.appendChild(el);
        },
        loadNewContactThread: async function (el, address) {
            let thread_box = document.createElement('span');
            thread_box.innerHTML = `${address.slice(0,9)}...`;
            thread_box.className = 'contact-box clickable';
            thread_box.value = address; // stack address in element value
            thread_box.onmousedown = function () {noledger.loadChat(address)}
            el.appendChild(thread_box)
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
        send: async function (address, msg) {
            key = this.contacts[address].key;
            pkg = {}
            pkg.payload = this.encrypt(msg, key);
            pkg.adress = this.encrypt(this.getAddress(), key);
            pkg.signature = this.encrypt('noledger', key);
            pkg.timestamp = new Date().getTime()
        }
    }
});