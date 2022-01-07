/*
            NOLEDGER

        Client-Side Code
*/


/* Base64URL encoding/decoding */
function b64Unescape (str) {
    return (str + '==='.slice((str.length + 3) % 4))
        .replace(/-/g, '+')
        .replace(/_/g, '/')
}

function b64Escape (str) {
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
        checkString: 'noledger-checksum-plaintext', // very mighty for custom encryption
        contacts: {},
        encryption: {
            encoder: new TextEncoder(),
            decoder: new TextDecoder(),
            rsa: {
                algorithm: "RSA-OAEP-256"
            },
            algorithm: {
                name: "RSA-OAEP",
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
        this.initKeyBindings();
    },

    methods: {
        animate: async function (el, type) {
            /* Global UI Animation Tool */
            if          (type == 'poke left') {
                backup = String(el.style.marginRight)
                m = 0
                for (let i = 0; i < 1000; i++) {
                    m += 0.01;
                    att = `${m}vw`;
                    el.style.marginRight = att;
                    this.sleep(.01)
                }
                for (let i = 0; i < 1000; i++) {
                    m -= 0.01;
                    att = `${m}vw`;
                    el.style.marginRight = att
                    this.sleep(.01)
                }
                el.style.marginRight = backup;
            } else if   (type == 'poke right') {
                backup = String(el.style.marginLeft)
                m = 0
                for (let i = 0; i < 1000; i++) {
                    m += 0.01;
                    att = `${m}vw`;
                    el.style.marginLeft= att;
                    this.sleep(.01)
                }
                for (let i = 0; i < 1000; i++) {
                    m -= 0.01;
                    att = `${m}vw`;
                    el.style.marginLeft = att
                    this.sleep(.01)
                }
                el.style.marginLeft = backup;
            }
        },
        backToContacts: async function () {
            this.wrapperVisible = true;
            this.chatVisible = false;
        },
        blob: async function (pkg, fresh=true) {
            /*
            Builds a msg box and appends it to the chat with blob sound.
                pkg - msg package
                fresh - if true: the msg is fresh and will be animated with sound
            */

                /* crude form
                <div #messageFrame .container>
                    <span .row>
                        <div .container>
                            <row_0>
                                <p>
                            <row>
                                <p .messageBox .green/blue>
                            <row_2>
                                <p .timeLabel>
                */

            // build & append msg box in chat frame
            frame = document.getElementById('messageFrame');
            span = document.createElement('span');
            p = document.createElement('p');
            span.className = 'row no-gutters'
             
            let msg_pkg = await this.renderMessage(pkg.msg);
            p.innerHTML = msg_pkg.output;
            let div = document.createElement('div');
                div.className = "container-fluid p-0";
            let row = document.createElement('div');
                row.className = "row no-gutters";
            
            // color and align dependence on type
            if (pkg.type == 'to') {
                div.className = 'messageBox green' 
                span.style.direction = 'rtl'
            } else {
                div.className = 'messageBox blue';
            }

            // --- menu row ---
            let menu = document.createElement('span');
                menu.className = 'container-fluid p-0 msgMenu';
                menu.innerHTML = "delete";
            let row_0 = document.createElement('div');
                row_0.className = "row no-gutters";
            let dots = document.createElement('a');
                dots.className = 'menuDots';
            row_0.style.direction = 'rtl';
            dots.innerHTML = '•••';
            dots.onmousedown = function () {
                this.style.color = 'aquamarine';
                noledger.animate()
            }
                // listen to simulated outside focus events
            document.addEventListener('click', function(e){   
                if (document.contains(e.target) && !dots.contains(e.target) ){
                    console.log('outside')
                    dots.style.color = '#ddd';
                    menu.remove()
                } else{
                    console.log('inside')
                }
            });

            // append datetime label
            let row_2 = document.createElement('div');
                row_2.className = "row no-gutters";
            let dt = document.createElement('p');
                dt.className = 'timeLabel';
            datetime =  new Date(pkg.time);
            weekDay = new Intl.DateTimeFormat('DE-DE', { weekday: 'long'}).format(datetime);
            timeString = datetime.toTimeString().split(' ')[0].split(':').slice(0,2).join(':');
            dt.innerHTML = `${weekDay}, ${timeString}`;

            // assemble
            row.appendChild(p);
            row_0.appendChild(dots);
            div.appendChild(row_0);
            div.appendChild(row);
            if (msg_pkg.thumbnail) { // append thumbnail if provided from url
                thumb_el = document.createElement('div');
                thumb_el.className = 'container-fluid p-0';
                div.appendChild(thumb_el);
                this.thumbnail(msg_pkg.thumbnail, thumb_el)
            }
            div.appendChild(row_2);
            span.appendChild(div);
            row_2.appendChild(dt);

            // decide whether to animate
            frame.appendChild(span);
            if (fresh) {
                if (pkg.type == 'to') {
                    this.animate(span, 'poke left')
                } else {
                    this.animate(span, 'poke right')
                }
            }

            this.scrollToBottom()
            return span
        },
        encrypt: async function (data, key) {
            const dataEncoded = await this.encryption.encoder.encode(data);
            let encrypted = await crypto.subtle.encrypt(this.encryption.algorithm, key, dataEncoded);
            return encrypted
        },
        decrypt: async function (cipher) {
            const dataEncoded = await crypto.subtle.decrypt(this.encryption.algorithm, this.keyPair.privateKey, cipher);
            let decoded = await this.encryption.decoder.decode(dataEncoded);
            return decoded
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
        initContact: async function (address) {
            // initializes entry in contacts database
            if (!(address in this.contacts)) {
                console.log('initialize contact -', address.slice(0,7), '...')
                _key = await this.keyImport(address)
                this.contacts[address] = {
                    key: _key,
                    stack: []
                }
            }
        },
        initKeyBindings: async function () {
            // bind enter key for msg sending
            document.getElementById("entryInput").onkeydown = function (e) {
                e = e || window.event;
                switch (e.keyCode) {
                    case 13 :
                        noledger.send()
                }
            }
        },
        keyExport: async function (key) {
            
            const exported = window.crypto.subtle.exportKey(
              "jwk",
              key
            );
            console.log('exported', exported)
            return exported
        
        },
        keyImport: async function (key, usage="encrypt") {
            // encode the key to base64url
            // key_enc = window.btoa(unb64unescape(encodeURIComponent( key )));
            // key_enc = key_enc.slice(0,key_enc.length-1)
            //key_enc = b64Escape(key_enc)
            key_enc = key;
            //console.log(key, '\n\n', key_enc)
            const imported = await crypto.subtle.importKey(
                "jwk",
                { 
                    kty: "RSA", 
                    e: "AQAB", 
                    n: key_enc,
                    alg: this.encryption.rsa.algorithm,
                    ext: true,
                },
                this.encryption.algorithm,
                false,
                [usage]
            );
            return imported
        },
        loadChat: async function (address) {
            this.toAddress = address;
            this.chatVisible = true;
            this.wrapperVisible = false;
            let frame = document.getElementById('messageFrame');
            frame.innerHTML = "" // flush
            // load messages from stack
            let stack = this.contacts[address].stack;
            for (let i = 0; i < stack.length; i++) {
                await this.blob(stack[i], false)
            }
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
                input_field.onkeydown = async function (e) {
                    e = e || window.event;
                    switch (e.keyCode) {
                        case 13 : //Your Code Here (13 is ascii code for 'ENTER')
                            address = await noledger.getAddress();  
                            test = true  
                            if (this.value != address || test) {
                                await noledger.initContact(address);
                                noledger.loadChat(this.value);
                                noledger.loadNewContactThread(document.getElementById('contacts-wrapper'), this.value);
                            } else {
                                this.value = '';
                                this.placeholder = 'cannot add your own address.'
                                await noledger.sleep(3);
                                this.placeholder = 'enter address';
                                console.log('ERROR: you cannot add your own address.')
                            }
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
            el.appendChild(thread_box);
        },
        receive: async function (address, pkg={}) {
            await this.initContact(address);
            x = "Hello World! https://github.com/B0-B";
            pkg.cipher = x;
            pkg.time = new Date().getTime()
            let message = pkg.cipher,
                time = pkg.time,
                type = 'from';
            internal = {msg: message, time: time, type: type };
            this.contacts[address].stack.push(internal)
            this.blob(internal, fresh=true)
        },
        renderMessage: async function (sentence) {
            let output = '';
            words = sentence.split(' ');
            let thumbnail = false,
                el,
                url;
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (word.includes('https://') || word.includes('http://')) {
                    output += `<a href="${word}" target="_blank">${word}</a>`;
                    if (thumbnail == false) {
                        thumbnail = true;
                        el = document.createElement('div');
                        el.src = word;
                        el.className = 'container-fluid p-0 thumbnail'
                        url = word;
                    }
                } else {
                    output += word
                }
                if (i != words.length-1) {
                    output += ' ';
                }
            }
            if (thumbnail) {
                try {
                    thumbnail = url;
                } catch (error) {
                    console.log(error);
                    thumbnail = null
                }
                
            } else {
                thumbnail = null
            }
            return {'output': output, 'thumbnail': thumbnail}
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
        scrollToBottom: function () {
            // scrolls current chat to bottom
            if (this.chatVisible) {
                const frame = document.getElementById('messageFrame')
                frame.scrollTop = frame.scrollHeight;
            }
        },
        send: async function () {

            // draw current address and msg
            const entry = document.getElementById('entryInput');
            const msg = `${entry.value}`;
            const address = this.toAddress;

            // export the contact public key
            const key = this.contacts[address].key;

            // reset entry
            entry.value = '';

            // encrypt msg
            pkg = {}
            try {
                check = await this.encrypt(this.checkString, key);
                cipher = await this.encrypt(msg, key);
                from = await this.encrypt(this.getAddress(), key);
            } catch (error) {
                console.log("encryption error", error)
            } finally {
                // remove key from variable
                delete key;
            }
            
            // build package
            pkg = {
                "time": new Date().getTime(),
                "from": escape(from).toString(),
                "cipher": escape(cipher).toString()
            }

            // append another pkg suited for client chat window
            internal = {msg: msg, time: pkg.time, type: 'to' };
            this.contacts[address].stack.push(internal);

            // build & load blob msg window
            let msgBox = this.blob(internal, fresh=true);

            // finally send pkg to api
            console.log('pkg for send', pkg)
            let response = await this.request(pkg, '/submit');
            console.log(response)
        },
        sleep: function (seconds) {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve(0);
                }, 1000*seconds);
            });
        },
        thumbnail: async function (url, anchor=null) {

            /* This function builds an interactive thumbnail element for showcasing websites */

            /* fetch the url provided */
            var response = await fetch(url);

            /* extract protocol and domain */
            let protocol;
            if (url.includes('https')) {
                protocol = 'https://'
            } else {
                protocol = 'http://'
            } let domain = url.replace(protocol,'').split('/')[0];

            /* Extract html object */
            rawHtml = await response.text();
            const parser = new DOMParser();
            let dom = parser.parseFromString(rawHtml, "text/html").documentElement;
            let body = dom.querySelector('body');

            // extract demanded data from dom object
            extractedTitle = dom.getElementsByTagName('title')['0'].innerHTML;
            
            /* pick a suitable image candidate */
            let candidate;
            let host = 'https://' + location.host;
            for (let tagName of ['img', 'svg']) {
                const images = body.getElementsByTagName(tagName);
                for (let img of images) {
                    try {
                        let uri = img.src;
                        //console.log('uri', uri);
                        if (uri.includes(host)) {
                            path = uri.replace(host, '');
                            uri.replace(host, protocol + domain + path)
                        } 
                        let img_el = document.createElement(tagName);
                        img_el.src = uri;
                        /* pick only images of minimum size */
                        //console.log('uri', uri, 'element height', img_el.height);
                        await this.sleep(0.04)
                        if (img_el.height >= 100) { 
                            candidate = img_el;
                            break;
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                if (candidate) {break}
            }

            // build thumbnail object
            tn = document.createElement('a');
            tn.className = "thumbnail-container";
            
            // append link and make thumbnail clickable
            tn.style.cursor = "pointer";
            tn.href = url;
            tn.target = "_blank";
            
            // add a caption
            caption = document.createElement('div');
            caption.className = "thumbnail-text-centered";
            caption.style.pointerEvents = "none";
            caption.innerHTML = `<strong>${domain}</strong><br><p>${extractedTitle}</p>`
            tn.appendChild(caption);

            /* if a candidate was picked append the fetched image */
            if (candidate) {
                candidate.className = "thumbnail";
                tn.appendChild(candidate);
            } else {
                /* try to draw the favicon instead */
                tn.style.minHeight = "200px";
                tn.style.height = "200px";
                let favicon = document.createElement('img');
                favicon.className = "thumbnail";
                favicon.src = protocol + domain + '/favicon.ico';
                console.log('favicon url', favicon.src)
                tn.appendChild(favicon);
            }
            if (anchor) {
                anchor.appendChild(tn);
            }
            this.scrollToBottom()
            return tn
        }    
    }
});