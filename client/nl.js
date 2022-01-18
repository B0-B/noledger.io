/*
           © NOLEDGER

        Client-Side Code

This code is served by the noledger 
node and connects all users to the 
ledger. The API sends JSON requests
with correct encoding back to the node
and listens to ledger entries for
incoming messages.
*/


// ======= Buffer covnersions =======
function buf2str(buffer) {
    var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa( binary );
}

function str2buf(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

async function testBuffer () {
    _key = await noledger.keyPair.publicKey
    console.log('key', _key)
    console.log('output', await noledger.decrypt(str2buf(JSON.parse(JSON.stringify({x:buf2str(await noledger.encrypt('hello world !', _key))})).x) ))
} 
// ==================================


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
        address: null,
        chatVisible: false,
        checkString: 'noledger-checksum-plaintext',
        contacts: {},
        encryption: {
            /*  
                A 2048 bit RSA key allows for 256 bytes of which the OAEP padding takes 42 bytes, 
                leaving around 214 bytes for encrypted data. An AES-256 key is 256 bits (32 bytes) 
                long, so there is plenty of space for it.
            */
            encoder: new TextEncoder(),
            decoder: new TextDecoder(),
            aes: {
                algorithm: 'AES-GCM',
                ascii: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"§$%&/()=?`+*~#-_.:,;€@^°\\{]öäüÖÜÄß`' + "'",
                currentAESkey: null,
                length: 256,
                ivLength: 16
            },    
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
        id: 0,
        keyPair: {},
        sounds: {
            mute: false
        },
        toAddress: '',
        wrapperVisible: true,
    },

    mounted: async function () {
        this.initKeyBindings();
        this.initSounds();
        this.initListener();
    },

    methods: {
        aesDecrypt: async function (encrypted, cryptoKey=null) {
            if (!cryptoKey) {cryptoKey = await this.encryption.aes.currentAESkey}
            encrypted.encrypted = str2buf(encrypted.encrypted);
            encrypted.iv = str2buf(encrypted.iv);
            const algo = { name: this.encryption.aes.algorithm, iv: encrypted.iv };
            const encodedBuffer = await crypto.subtle.decrypt(algo, cryptoKey, encrypted.encrypted);
            console.log('encoded buffer', encodedBuffer)
            const decoded = await this.encryption.decoder.decode(encodedBuffer);
            return decoded
        },
        aesEncrypt: async function (plainText) {
            const encodedText = this.encryption.encoder.encode(plainText);
            const byteLength = this.encryption.aes.ivLength;    
            const iv = crypto.getRandomValues(new Uint8Array(byteLength));                               // generate a random 4096 bit or 16 byte vector
            const algo = { name: this.encryption.aes.algorithm, iv: iv };
            const key = await this.encryption.aes.currentAESkey;
            console.log('key show', key)
            let encrypted = await crypto.subtle.encrypt(algo, key, encodedText);  
            encrypted_b64 = buf2str(encrypted);       
            iv_b64 = buf2str(iv);         
            return encrypted = {"encrypted": encrypted_b64, "iv": iv_b64}
        },
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
            p.style.direction = 'ltr';
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
        generateAESkeyFromPhrase: async function (phrase=null) {
            if (!phrase) {
                phrase = await this.generateRandomBytes(16);
            }
            const pwEncoded = this.encryption.encoder.encode(phrase);                                           // utf8 encode phrase string as seed for AES key
            const pwHash = await crypto.subtle.digest('SHA-256', pwEncoded);                                    // Hash the encoded seed
            const algo = { name: this.encryption.aes.algorithm };
            const aesKey = await crypto.subtle.importKey('raw', pwHash, algo, false, ['encrypt', 'decrypt']);   // construct a CryptoKey from phrase
            return aesKey;
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
            this.address = await this.getAddress();
            // build contacts page
            await this.loadContactsPage();
        },
        generateRandomBytes: async function (length) {
            let pad = '';
            for (let i = 0; i < length; i++) {
                pad += this.encryption.aes.ascii[Math.floor(Math.random()*this.encryption.aes.ascii.length)]
            }
            return pad
        },
        getAddress: async function () {
            let pub = await this.keyExport(this.keyPair.publicKey);
            console.log('public',pub)
            return pub.n;
        },
        initContact: async function (address) {
            
            if (!(address in this.contacts)) {                                                                  // if contact was not initialized yet
                                                                  
                console.log('initialize contact -', address.slice(0,7), '...');
                let _key = await this.keyImport(address);                                                       // construct RSA key from address

                const phrase = await this.generateRandomBytes(16);                                              // remember construction phrase 
                const aesKey = await this.generateAESkeyFromPhrase(phrase);                                     // construct AES key from phrase

                this.contacts[address] = {                                                                      // append to contacts object
                    aesBuffer: aesKey,
                    aesPhrase: phrase,
                    key: _key,
                    stack: [],
                    unread: 0
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
        initListener: async function () {
            console.log('start listener ...')
            while (true) {
                try {
                    if (Object.keys(this.keyPair).length > 0) {
                        
                        const response = await this.request({id: this.id}, '/ledger');
                        const collection = Array.from(response.collection);                                     // get collected messages from API

                        for (let pkg of collection) {                                                           // iterate through packages in returned collection
                            if (pkg) {
                                try {

                                    let check_decrypted;                                                        // try to decrypt the check
                                    try {
                                        check_decrypted = await this.decrypt(str2buf(pkg.check));
                                    } catch (error) {
                                        console.log('skip pkg ...')
                                        check_decrypted = null
                                    }
                                    
                                    if (check_decrypted == this.checkString) {                                  // on success
        
                                        let aesPhrase = await this.decrypt(str2buf(pkg.phrase));                // extract credentials from the pkg
                                        let aesKey = await this.generateAESkeyFromPhrase(phrase=aesPhrase);     // reconstruct the aesKey from the phrase
                                        
                                        let msg = await this.aesDecrypt(pkg.cipher, aesKey);                    // decrypt body and senders address
                                        let from = await this.aesDecrypt(pkg.from, aesKey);
        
                                        if (!(from in this.contacts)) {                                         // initialize new contact if it doesn't exist
                                            let wrapper = document.getElementById('contacts-wrapper');
                                            await this.initContact(from);
                                            await this.loadNewContactThread(wrapper, from);                     // add a new chat in contacts page
                                        }
                                        
                                        let internal = {                                                        // append new internal message
                                            time: new Date().getTime(),
                                            type: 'from',
                                            msg: msg
                                        }; this.contacts[from].stack.push(internal);
                                        
                                        if (!this.sounds.mute){this.sounds.inbox.play()}                        // new message sound
        
                                        if (this.chatVisible && this.toAddress == from) {                       // decide wether to build a blob in chat or increment the unread tag
                                            this.blob(internal, true);
                                        } else {
                                            this.newUnreadMessage(from);
                                        }
                                    }
                                } catch (error) {
                                    console.log('decryption error')
                                    console.log(error)
                                }
                            }
                        }
                        this.id = response.id_high;                                                             // if everything worked without errors raise the ledger id
                                                                                                                // to the latest id observed on the ledger to avoid 
                                                                                                                // old packages and thus redundant downloads                                                                       
                    }
                } catch (error) {
                    console.log('request error', error)
                } finally {
                    await this.sleep(1);
                }
            }
        },
        initSounds: async function () {
            this.sounds.inbox = new Audio('./media/inbox.mp3');
            this.sounds.send = new Audio('./media/send.mp3');
        },
        keyExport: async function (cryptoKey) {
            
            const exported = window.crypto.subtle.exportKey(
              "jwk",
              cryptoKey
            );
            console.log('exported', exported)
            return exported
        
        },
        keyImport: async function (key, usage=['encrypt']) {
            // encode the key to base64url
            const imported = await crypto.subtle.importKey(
                "jwk",
                { 
                    kty: "RSA", 
                    e: "AQAB", 
                    n: key,
                    alg: this.encryption.rsa.algorithm,
                    ext: true,
                },
                this.encryption.algorithm,
                false,
                usage
            );
            return imported
        },
        loadChat: async function (address) {
            this.toAddress = address;
            this.chatVisible = true;
            this.wrapperVisible = false;
            let frame = document.getElementById('messageFrame');
            frame.innerHTML = "" // flush

            // draw current aes key for this session
            this.encryption.aes.currentAESkey = this.contacts[address].aesBuffer; //await this.decrypt(this.contacts[address].aesBuffer);

            // load messages from the current stack
            let stack = this.contacts[address].stack;
            for (let i = 0; i < stack.length; i++) {
                await this.blob(stack[i], false)
            }
            this.scrollToBottom();
            this.noUnreadMessages(address);
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

            // set aes key back to null
            this.encryption.aes.currentAESkey = null;
            
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
                        case 13 : 
                            // Code for enter input
                            address = await noledger.getAddress();  
                            test = false
                            console.log('this.value', this.value)
                            if (this.value != address || test) {
                                await noledger.initContact(this.value);
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
            el.appendChild(el_payload);
            parent.appendChild(el);
        },
        loadNewContactThread: async function (el, address) {
            let thread_box = document.createElement('span');
            thread_box.innerHTML = `<div>${address.slice(0,9)}...</div>   <div class="unread"></div>`;
            thread_box.className = 'contact-box clickable';
            thread_box.onmousedown = function () {noledger.loadChat(address)}
            el.appendChild(thread_box);

            // store address
            let addTag = document.createElement('address');
            addTag.style.display = 'none';
            addTag.innerHTML = address;
            thread_box.appendChild(addTag)
            //thread_box.value = address; // stack address in element value

        },
        newUnreadMessage: async function (address) {
            /* Increments the unread variable of the contact. The contact needs to exist already. */
            // find the correct unread tag from threadBox
            let threadBox = Array.from(document.querySelectorAll('address')).filter(function (el) {
                return el.innerHTML === address
            })[0].parentElement;
            let unreadTag = threadBox.querySelector('div[class="unread"]');
            console.log('unread', unreadTag);
            if (unreadTag) {
                this.contacts[address].unread += 1;
                unreadTag.innerHTML = this.contacts[address].unread;
                unreadTag.style.paddingLeft = "5px";
                unreadTag.style.paddingRight = "5px";
            }
        },
        noUnreadMessages: async function (address) {
            /* Increments the unread variable of the contact. The contact needs to exist already. */
            // find the correct unread tag from threadBox
            let threadBox = Array.from(document.querySelectorAll('address')).filter(function (el) {
                return el.innerHTML === address
            })[0].parentElement;
            let unreadTag = threadBox.querySelector('div[class="unread"]');
            console.log('unread', unreadTag);
            if (unreadTag) {
                this.contacts[address].unread = 0;
                unreadTag.innerHTML = '';
                unreadTag.style.paddingLeft = "0px";
                unreadTag.style.paddingRight = "0px";
            }
        },
        ping: async function () {
            this.send('🏓')
        },
        renderMessage: async function (sentence) {
            /* Message string renders to html compliant output */
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
        request: function (options, path, json=true) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest(); 
                xhr.open("POST", path, true); 
                if (json) {
                    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
                }
                xhr.onreadystatechange = function () {  
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var json = JSON.parse(xhr.responseText);
                        if (Object.keys(json).includes('errors') && json['errors'].length != 0) { // if errors occur
                            console.log('server:', json['errors'])
                        } resolve(json);
                    }
                }
                xhr.onerror = function(e) {
                    console.log(e)
                    reject({'errors': ['error during request: no connection']})
                }
                xhr.send(JSON.stringify(options)); 
            });
        },
        scrollToBottom: function () {
            if (this.chatVisible) {
                const frame = document.getElementById('messageFrame')
                frame.scrollTop = frame.scrollHeight;
            }
        },
        send: async function (msg=null) {

            if (!this.chatVisible) {return}                                             // prevent sending if chat is not visible
            
            const address = this.toAddress;                                             // determine to address
            const fromAddress = await this.getAddress();                                // determine from address
            
            if (!msg) {                                                                 // if no message was provided draw from input field
                const entry = document.getElementById('entryInput');
                msg = `${entry.value}`;
                entry.value = '';                                                       // reset entry field
            }

            const key = this.contacts[address].key;                                     // extract credentials for crypto
            const aesPhrase = this.contacts[address].aesPhrase;

            const timestamp = new Date().getTime();

            try {
                check = await this.encrypt(this.checkString, key);                      // asymmetrically encode check string and credentials for tracking
                phrase = await this.encrypt(aesPhrase, key);
                cipher = await this.aesEncrypt(msg);                                    // aes for heavy payloads
                from = await this.aesEncrypt(fromAddress);
            } catch (error) {
                console.log("encryption error")
                throw error
            } finally {
                delete key;                                                             // delete credential pointers for safety
                delete aesPhrase;
            }
            
            pkg = {                                                                     // build package for request
                time: new Date().getTime(),
                check: buf2str(check),
                from: from,
                cipher: cipher,
                phrase: buf2str(phrase)
            }

            if (!this.sounds.mute) {this.sounds.send.play()}                            // play a send sound

            internal = {msg: msg, time: timestamp, type: 'to' };                        // append another pkg suited for client chat window
            this.contacts[address].stack.push(internal);

            this.blob(internal, fresh=true);                                            // build & load blob msg window

            let response = await this.request(pkg, '/submit');                          
            console.log('API', response)
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