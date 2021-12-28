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
        keyExport: async function (key) {
            const exported = window.crypto.subtle.exportKey(
              "jwk",
              key
            );
            return exported
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
            return pub.n;
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
                el.appendChild(input_field);
                parent.appendChild(el);

                // reload contact button on out focus
                input_field.onmouseout = function () {
                    el.remove()
                    console.log('blur')
                    noledger.loadNewContactButton(parent)
                }

                parent.appendChild(el)
            }

            //el.className = "new-contact";
            el.appendChild(el_payload);
            parent.appendChild(el);
        },
        loadNewContactThread: async function (el, address) {
            let thread_box = document.createElement('span');
            thread_box.innerHTML = `${address.slice(0,9)}...`;
            thread_box.className = 'thread-box';
            thread_box.nodeValue = address;
            el.appendChild(thread_box)
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