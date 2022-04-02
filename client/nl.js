/*
==================================================================
noledger.io
Client-Side Code Copyright © 2022 noledger
Author: B0-B (alch3mist94@protonmail.com)
------------------------------------------------------------------


==================================================================
*/


/* ---- Buffer covnersions ---- */
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
/* ---------------------------- */


/* ------- Proof of Work Algo --------- */
async function hash(input, algo='SHA-256') {
    /*
    A quick & dirty hashing function.
    */
    const msgUint8 = new TextEncoder().encode(input);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest(algo, msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

async function mine(input, difficulty, algo='SHA-256', encoder=null) {
    let nonce = 0;
    check = ""
    for (let i = 0; i < difficulty; i++) {
        check += "0"
    }
    while (true) {
        const h = await hash(input+nonce, algo, encoder)
        //console.log(h)
        //break
        if (h.slice(0, difficulty) == check) {
            return nonce
        } else {
            nonce += 1
        }
    }
}
/* ------------------------------------ */

/* --- noledger main object --- */
var noledger = new Vue({

    el: '#noledger',

    /* Object architecture 
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
        checkString: 'noledger-default-check',
        checkStringDefault: 'noledger-default-check',
        contacts: {},
        displayAddress: '', // displayed address in the chat frame header
        emojiString: "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 🤡 🤠 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 🤤 😭 😓 😪 😴 🙄 🤔 🤥 😬 🤐 🤢 🤮 🤧 😷 🤒 🤕 🤨 🤩 🤯 🧐 🤫 🤪 🥺 🤭 🥱 🥳 🥴 🥲 🥸 🥶 🥵 😈 👿 🤬 👹 👺 💩 👻 💀 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 😿 😾 🙀 \n\n👐 🙌 👏 🙏 🤝 👍 👎 👊 ✊ 🤛 🤜 🤞 🤘 👌 👈 👉 👆 👇 ✋ 🤚 🖐 🖖 👋 🤙 💪 🖕 🤟 🤲 🤳 💅 🖖 💋 👄 👅 👂 👃 👣 👁 🧠 🦷 🦴 👀 \n\n🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐚 🐞 🐜 🕷 🕸 🐢 🐍 🦎 🦂 🦀 🦑 🐙 🦐 🐠 🐟 🐡 🐬 🦈 🐳 🐋 🐊 🐆 🐅 🐃 🐂 🐄 🦌 🐪 🐫 🐘 🦏 🦍 🐎 🐖 🐐 🐏 🐑 🐕 🐩 🐈 🐓 🦃 🕊 🪶 🐇 🐁 🐀 🐿 🐾 🐉 🐲 🦖 🦕 🦒 🦔 🦓 🦗 🦧 🦮 🦥 🦦 🦨 🦩 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🌾 💐 🌷 🌹 🥀 🌻 🌼 🌸 🌺 🌎 🌍 🌏 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔 🌚 🌝 🌞 🌛 🌜 🌙 💫 ⭐️ 🌟 ✨ ⚡️ 🔥 💥 ☄️ 🛸 ☀️ 🌤 ⛅️ 🌥 🌦 🌈 ☁️ 🌧 ⛈ 🌩 🌨 ☃️ ⛄️ ❄️ 🌬 💨 🌪 🌫 🌊 💧 💦 ☔️ \n\n🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🍍 🥝 🥑 🍅 🍆 🥒 🥕 🌽 🌶 🥔 🍠 🌰 🥜 🍯 🥐 🍞 🥖 🧀 🥚 🍳 🥓 🧄 🧅 🥞 🧇 🍤 🍗 🍖 🍕 🌭 🍔 🍟 🥙 🌮 🌯 🥗 🥘 🍝 🍜 🦪 🍲 🍥 🍣 🍱 🍛 🍚 🧆 🍙 🍘 🍢 🍡 🍧 🍨 🍦 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🥛 🧈 🍼 ☕️ 🍵 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🍾 🧉 🧃 🧊 🥄 🍴 🍽 \n\n⚽️ 🏀 🏈 ⚾️ 🎾 🏐 🏉 🎱 🏓 🏸 🥅 🏒 🏑 🏏 ⛳️ 🏹 🎣 🥊 🥋 ⛸ 🎿 ⛷ 🏂 🏋️‍♀️ 🏋️ 🤺 🤼‍♀️ 🤼‍♂️ 🤸‍♀️ 🤸‍♂️ ⛹️‍♀️ ⛹️ 🤾‍♀️ 🤾‍♂️ 🏌️‍♀️ 🏌️ 🏄‍♀️ 🏄 🏊‍♀️ 🏊 🤽‍♀️ 🤽‍♂️ 🚣‍♀️ 🚣 🤿 🏇 🚴‍♀️ 🚴 🚵‍♀️ 🚵 🎽 🏅 🎖 🥇 🥈 🥉 🏆 🏵 🎗 🎫 🎟 🎪 🤹‍♀️ 🤹‍♂️ 🎭 🎨 🎬 🎤 🎧 🎼 🎹 🥁 🎷 🎺 🎸 🎻 🪕 🎲 🎯 🎳 🪀 🪁 🎮 🎰 \n\n🚗 🚕 🚙 🚌 🚎 🏎 🚓 🚑 🚒 🚐 🚚 🚛 🚜 🛴 🚲 🛵 🏍 🛺 🚨 🚔 🚍 🚘 🚖 🚡 🚠 🚟 🚃 🚋 🚞 🚝 🚄 🚅 🚈 🚂 🚆 🚇 🚊 🚉 🚁 🛩 ✈️ 🛫 🛬 🪂 🚀 🛰 🛸 💺 🛶 ⛵️ 🛥 🚤 🛳 ⛴ 🚢 ⚓️ 🚧 ⛽️ 🚏 🚦 🚥 🗺 🗿 🗽 ⛲️ 🗼 🏰 🏯 🏟 🎡 🎢 🎠 ⛱ 🏖 🏝 ⛰ 🏔 🗻 🌋 🏜 🏕 ⛺️ 🛤 🛣 🏗 🏭 🏠 🏡 🏘 🏚 🏢 🏬 🏣 🏤 🏥 🏦 🏨 🏪 🏫 🏩 💒 🏛 ⛪️ 🕌 🕍 🛕 🕋 ⛩ 🗾 🎑 🏞 🌅 🌄 🌠 🎇 🎆 🌇 🌆 🏙 🌃 🌌 🪐 🌉 🌁 \n\n ⌚️ 📱 📲 💻 ⌨️ 🖥 🖨 🖱 🖲 🕹 🗜 💽 💾 💿 📀 📼 📷 📸 📹 🎥 📽 🎞 📞 ☎️ ⚖ ️📟 📠 📺 📻 🎙 🎚 🎛 ⏱ ⏲ ⏰ 🕰 ⌛️ ⏳ 📡 🔋 🔌 💡 🔦 🕯 🗑 🛢 💸 💵 💴 💶 💷 💰 💳 💎 🧿 ⚖️ 🔧 🔨 ⚒ 🛠 ⛏ 🪓 🧹 🔩 ⚙️ ⛓ 🔫 🪁 💣 🪒 🔪 🗡 ⚔️ 🛡 🚬 ⚰️ ⚱️ 🏺 🪔 🔮 📿 💈 ⚗️ 🔭 🔬 🕳 🦯 🩺 💊 💉 🩸 🩹 🦠 🧫 🧬 🌡 🚽 🚰 🚿 🛁 🛀 🛎 🔑 🗝 🚪 🛋 🛏 🛌 🪑 🖼 🛍 🛒 🎁 🎈 🎏 🎀 🎊 🎉 🎎 🏮 🎐 ✉️ 📩 📨 📧 💌 📥 📤 📦 🏷 📪 📫 📬 📭 📮 📯 📜 📃 📄 📑 📊 📈 📉 🗒 🗓 📆 📅 📇 🗃 🗳 🗄 📋 📁 📂 🗂 🗞 📰 📓 📔 📒 📕 📗 📘 📙 📚 📖 🔖 🔗 📎 🖇 📐 📏 📌 📍 🎌 🏳️ 🏴 🏁 🏳️‍🌈 ✂️ 🖊 🖋 ✒️ 🖌 🖍 📝 ✏️ 🔍 🔎 🔏 🔐 🔒 🔓 💄 👚 👕 👖 👔 👗 👙 👘 👠 👡 👢 👞 👟 👒 🎩 🎓 👑 ⛑ 🎒 🧳 👝 👛 👜 💼 👓 🕶 🌂 ☂️ 🪶 \n\n❤️ 💛 💚 💙 💜 🖤 🤎 🤍 🧡 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ☮️ ✝️ ☪️ 🕉 ☸️ ✡️ 🔯 🕎 ☯️ ☦️ 🛐 ⛎ ♈️ ♉️ ♊️ ♋️ ♌️ ♍️ ♎️ ♏️ ♐️ ♑️ ♒️ ♓️ 🆔 ⚛️ 🈳 🉑 ☢️ ☣️ 📴 📳 🈶 🈚️ 🈸 🈺 🈷️ ✴️ 🆚 🉐 ㊙️ ㊗️ 🈴 🈵 🈹 🈲 🅰️ 🅱️ 🆎 🆑 🅾️ 🆘 🚼 ❌ ⭕️ 🛑 ⛔️ 📛 🚫 💯 💮 💢 ♨️ 🚷 🚯 🚳 🚱 🔞 📵 🚭 ❗️ ❕ ❓ ❔ ‼️ ⁉️ 🔅 🔆 〽️ ⚠️ 🚸 🔱 ⚜️ 🔰 ♻️ ✅ 🈯️ 💹 ❇️ ✳️ ❎ 🌐 💠 Ⓜ️ 🌀 💤 🏧 🚾 ♿️ 🅿️ 🈂️ 🛂 🛃 🛄 🛅 🚹 🚺 🚻 🚮 ➿ 🎦 📶 🈁 🔣 ℹ️ 🔤 🔡 🔠 🆖 🆗 🆙 🆒 🆕 🆓 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔢 #️⃣ *️⃣ ▶️ ⏸ ⏯ ⏹ ⏺ ⏭ ⏮ ⏩ ⏪ ⏫ ⏬ ◀️ 🔼 🔽 ➡️ ⬅️ ⬆️ ⬇️ ↗️ ↘️ ↙️ ↖️ ↪️ ↩️ ⤴️ ⤵️ 🔀 🔁 🔂 🔄 🔃 🔚 🔙 🔛 🔝 🔜 ☑️ ↕️ ↔️ 🎵 🎶 ➕ ➖ ➗ ✖️ 💲 💱 ™️ ©️ ®️ 〰️ ➰ ✔️ 🔘 ⚫️ ⚪️ 🔴 🔵 🟣 ​​🟠​ 🟡​ 🟢​ ​🟣 ​🟤​ 🔺 🔻 🔸 🔹 🔶 🔷 🔳 🔲 ▪️ ▫️ ◾️ ◽️ ◼️ ◻️ ⬛️ ⬜️ ​🟥 ​🟧​ 🟨​ 🟩​ 🟦 ​🟪​ ​🟫​ 🔈 🔇 🔉 🔊 🔔 🔕 📣 📢 👁‍🗨 💬 💭 🗯 ♠️ ♣️ ♥️ ♦️ 🃏 🎴 🀄️ 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 🕛 🕜 🕝 🕞 🕟 🕠 🕡 🕢 🕣 🕤 🕥 🕦 🕧",
        emojiHtml: "",
        emojiVisible: false,
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
        lifetime: '1 Hour',
        settingsVisible: false,
        sounds: {
            mute: false
        },
        toAddress: '',
        wrapperVisible: true,
    },
    mounted: async function () {
        this.initKeyBindings();
        this.initSounds();
        this.initEmojis();
        this.destroyLoadFrameDelayed();
    },
    methods: {
        aesDecrypt: async function (encrypted, cryptoKey=null) {
            if (!cryptoKey) {cryptoKey = await this.encryption.aes.currentAESkey}
            encrypted.encrypted = str2buf(encrypted.encrypted);
            encrypted.iv = str2buf(encrypted.iv);
            const algo = { name: this.encryption.aes.algorithm, iv: encrypted.iv };
            const encodedBuffer = await crypto.subtle.decrypt(algo, cryptoKey, encrypted.encrypted);
            const decoded = await this.encryption.decoder.decode(encodedBuffer);
            return decoded
        },
        aesEncrypt: async function (plainText, cryptoKey=null) {
            const encodedText = this.encryption.encoder.encode(plainText);
            const byteLength = this.encryption.aes.ivLength;    
            const iv = crypto.getRandomValues(new Uint8Array(byteLength));                               // generate a random 4096 bit or 16 byte vector
            const algo = { name: this.encryption.aes.algorithm, iv: iv };
            let key;
            if (cryptoKey) {
                key = cryptoKey;
            } else {
                key = await this.encryption.aes.currentAESkey;
            }
            let encrypted = await crypto.subtle.encrypt(algo, key, encodedText);  
            encrypted_b64 = buf2str(encrypted);       
            iv_b64 = buf2str(iv);         
            return encrypted = {"encrypted": encrypted_b64, "iv": iv_b64}
        },
        backToContacts: async function () {
            this.wrapperVisible = true;
            this.chatVisible = false;
            this.emojiVisible = false;
            this.settingsVisible = false;
            this.toAddress = "";
            document.getElementById('emojiFrame').scrollTop = 0;
            document.getElementById("entryInput").value = "";
            this.entryCollapse(); // untoggle the entry
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
            if (this.emojiString.includes(pkg.msg) && !pkg.msg.includes(' ')) {
                p.style.fontSize = "5rem"
            }
            let div = document.createElement('div');
                div.className = "container-fluid p-0";
            let row = document.createElement('div');
                row.className = "row no-gutters";
            
            // color and align dependence on type
            if (pkg.type == 'to') {
                div.className = 'messageBox message-green-background' 
                span.style.direction = 'rtl'
            } else {
                div.className = 'messageBox blue-background';
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
            }
                // listen to simulated outside focus events
            document.addEventListener('click', function(e){   
                if (document.contains(e.target) && !dots.contains(e.target) ){
                    dots.style.color = '#ddd';
                    menu.remove()
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

            frame.appendChild(span);

            this.scrollToBottom()
            return span
        },
        decrypt: async function (cipher) {

            /*
            RSA asym. encrypt function
            + added random padding for random cipher obfuscation [np-1]
            */

            const dataEncoded = await crypto.subtle.decrypt(this.encryption.algorithm, 
                this.keyPair.privateKey, cipher);
            let decoded = await this.encryption.decoder.decode(dataEncoded);

            const decodedWordArray = decoded.split(" ");                                                // remove the padding i.e. the last word
            const slicedWordArray = decodedWordArray.slice(0, decodedWordArray.length-1)                // override decoded text and discard padding
            decoded = slicedWordArray.join(" ")
            return decoded
        },
        destroyLoadFrameDelayed: async function () {
            await this.sleep(1);
            document.getElementById('load-frame').remove()
        },
        dumpAccount: async function (password) {
            
            /* 
            Dumps account encrypted with a pass phrase into a file. 
            */

            // isolate contact information
            contacts = {}
            for (let key in this.contacts) {
                c = Object.assign({}, this.contacts[key]);
                c.stack = [];
                contacts[key] = c;
            }

            // create package for dump
            pkg = {
                checkstring: this.checkString,
                contacts: contacts,
                keypair: this.keyPair,
                lifetime: this.lifetime,
                id: this.id
            }

            // generate AES key from the password provided
            const key = await this.generateAESkeyFromPhrase(password);

            // encrypt the package
            const pkgEncrypted = await this.aesEncrypt(pkg, key);

            // encode to hex and return
            const pkgEncryptedEncoded = this.encryption.encoder.encode(JSON.stringify(pkgEncrypted));
            const pkgEncryptedEncoded2HEX = buf2str(pkgEncryptedEncoded);
            console.log('encoded string', pkgEncryptedEncoded2HEX)

            // prepare file for download
            const filename = 'account.nl'
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pkgEncryptedEncoded2HEX));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            //return pkgEncryptedEncoded2HEX

        },
        dumpAccountAction: async function () {

            // create a input field
            await this.notifyReadAndCallback(
                "Enter a PIN to protect the account:",
                this.dumpAccount,
                true,
                "download",
                "Please check your download folder."
            )

        },
        generateAESkeyFromPhrase: async function (phrase=null) {
            /* Secure method which creates a cryptoKey with AES algorithm constructed from a provided phrase. */  
            if (!phrase) {
                phrase = await this.generateRandomBytes(16);
            }
            const pwEncoded = this.encryption.encoder.encode(phrase);                                           // utf8 encode phrase string as seed for AES key
            const pwHash = await crypto.subtle.digest('SHA-256', pwEncoded);                                    // Hash the encoded seed
            const algo = { name: this.encryption.aes.algorithm };
            const aesKey = await crypto.subtle.importKey('raw', pwHash, algo, false, ['encrypt', 'decrypt']);   // construct a CryptoKey from phrase
            return aesKey;
        },
        encrypt: async function (data, key) {

            /*
            RSA asym. encrypt function
            + added random padding for random cipher obfuscation [np-1]
            */

            const pad = await this.generateRandomBytes(8);                                                      // random padding [np-1]
            const dataEncoded = await this.encryption.encoder.encode(data + " " + pad);                         // encode data with padding appended
            let encrypted = await crypto.subtle.encrypt(this.encryption.algorithm, key, dataEncoded);
            
            return encrypted
        },
        entryCollapse: async function () {
            // document.getElementById("entryFrame").classList.remove('slide-height-expanded');
            // document.getElementById("entryFrame").classList.add('slide-height-collapsed');
            document.getElementById("entryInput").classList.remove('slide-height-expanded');
            document.getElementById("entryInput").classList.add('slide-height-collapsed');
            document.getElementById("messageFrame").classList.remove('slide-padding-expanded');
            document.getElementById("messageFrame").classList.add('slide-padding-collapsed');
            document.getElementById("emojiFrame").classList.remove('slide-padding-expanded');
            document.getElementById("emojiFrame").classList.add('slide-padding-collapsed');
            document.getElementById("entryInput").style.minWidth = "40vw";
            document.getElementById("entryInput").blur()

        },
        entryExpand: async function () {
            /* 
            Expands the message input in chat window on focus.
            */
            // document.getElementById("entryFrame").classList.remove('slide-height-collapsed');
            // document.getElementById("entryFrame").classList.add('slide-height-expanded');
            document.getElementById("entryInput").classList.remove('slide-height-collapsed');
            document.getElementById("entryInput").classList.add('slide-height-expanded');
            document.getElementById("messageFrame").classList.remove('slide-padding-collapsed');
            document.getElementById("messageFrame").classList.add('slide-padding-expanded');
            document.getElementById("emojiFrame").classList.remove('slide-padding-collapsed');
            document.getElementById("emojiFrame").classList.add('slide-padding-expanded');
            document.getElementById("entryInput").style.minWidth = "60vw";
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

            /*
            Creates new account from scratch and starts all necessary services.
            */

            console.log("generate new account ...")
            this.keyPair = await this.generateKeyPair();                    // generate new rsa key pair
            
            let wrapper = document.getElementById('wrapper');               // flush wrapper content
            wrapper.innerHTML = "";
            this.address = await this.getAddress();
            
            await this.loadContactsPage();                                  // build contacts page
            this.initCleanerHook();                                         // start cleaner once the account is available
            this.initLedgerHook();                                          // start the ledger reading

        },
        generateRandomBytes: async function (length) {

            /*
            Generate Bytes of specified length.
            */
            
            let pad = '';
            for (let i = 0; i < length; i++) {
                pad += this.encryption.aes.ascii[Math.floor(Math.random()*this.encryption.aes.ascii.length)]
            }
            return pad

        },
        getAddress: async function () {
            let pub = await this.keyExport(this.keyPair.publicKey);
            return pub.n;
        },
        initCleanerHook: async function () {
            /* A loop which deletes expired messages */
            while (true) {
                try {
                    if (this.lifetime.includes('Never')) {
                        /* do nothing */
                    } else {
                        let now = new Date().getTime(), lt, changes = false;
                        // determine lifetime in seconds
                        if (this.lifetime.includes('1 Hour')) {
                            lt = 3600
                        } else if (this.lifetime.includes('60')) {
                            lt = 60
                        } else if (this.lifetime.includes('15')) {
                            lt = 300
                        } else if (this.lifetime.includes('5')) {
                            lt = 900
                        } else if (this.lifetime.includes('30')) {
                            lt = 1800
                        } else if (this.lifetime.includes('3')) {
                            lt = 10800
                        } else if (this.lifetime.includes('6')) {
                            lt = 21600
                        } else if (this.lifetime.includes('Daily')) {
                            lt = 86400
                        }
                        for (let key in this.contacts) {
                            for (let i = 0; i < this.contacts[key].stack.length; i++) {
                                msg = this.contacts[key].stack[i]
                                timestamp = msg.time;
                                diff = (now - timestamp) * 0.001 
                                if (diff > lt && i != this.contacts[key].stack.length-1) {
                                    // leapfrog expired msg
                                } else if (diff > lt && i == this.contacts[key].stack.length-1) {
                                    this.contacts[key].stack = []
                                    this.noUnreadMessages(key);
                                    if (this.toAddress == key && i > 0) {
                                        this.loadChat(key)
                                    }
                                } else {
                                    this.contacts[key].stack = this.contacts[key].stack.slice(i)
                                    if (this.toAddress == key && i > 0) {
                                        this.loadChat(key)
                                    }
                                    break
                                }
                            }   
                        }
                    }
                } catch (error) {
                    console.log('cleaner', error)
                } finally {
                    await this.sleep(5)
                }
            }
        },
        initContact: async function (address) {
            
            if (!(address in this.contacts)) {                                                                  // if contact was not initialized yet
                                                                  
                console.log('initialize contact -', address.slice(0,7), '...');
                let _key = await this.keyImport(address);                                                       // construct RSA key from address

                const phrase = await this.generateRandomBytes(16);                                              // remember construction phrase 
                const aesKey = await this.generateAESkeyFromPhrase(phrase);                                     // construct AES key from phrase

                const check = this.checkStringDefault;                                                          // set the default specific check string for the contact

                this.contacts[address] = {                                                                      // append to contacts object
                    aesBuffer: aesKey,
                    aesPhrase: phrase,
                    check: check,                                                                               // encrypted check string
                    key: _key,
                    stack: [],
                    unread: 0
                }
            }
        },
        initEmojis: async function () {
            /* initialize emoji frame in chat by breaking up the emoji string */
            const emojiFrame = document.getElementById('emojiFrame');
            emojiFrame.classList.add('burned-bisque-transparent-background');
            const emojiSets = this.emojiString.split("\n\n");
            for(let set of emojiSets) {
                const emojiSetArray = set.split(" ");
                for (let emoji of emojiSetArray) {
                    emojiFrame.innerHTML += `<span class="emoji" onclick=noledger.loadEmoji('${emoji}')>${emoji}</span>`
                } emojiFrame.innerHTML += '<br><br><br>'
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
            document.getElementById("entryInput").onfocus = async function (e) {
                noledger.entryExpand()
            }
            document.getElementById("messageFrame").onmousedown = async function (e) {
                noledger.entryCollapse()
            }
        },
        initLedgerHook: async function () {
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
                                        check_decrypted = await this.decrypt(str2buf(pkg.header));
                                    } catch (error) {
                                        check_decrypted = null
                                    }

                                    if (check_decrypted == this.checkString) {                                  // on success (1. Factor)

                                        let aesPhrase = await this.decrypt(str2buf(pkg.phrase));                // extract credentials from the pkg
                                        let aesKey = await this.generateAESkeyFromPhrase(phrase=aesPhrase);     // reconstruct the aesKey from the phrase
                                        
                                        let msg = await this.aesDecrypt(pkg.cipher, aesKey);                    // decrypt body and senders address
                                        let from = await this.aesDecrypt(pkg.from, aesKey);

                                        let check2 = await this.decrypt(str2buf(pkg.check));                   // decrypt user specific check string

                                        if (!(from in this.contacts)) {                                         // initialize new contact if it doesn't exist
                                            let wrapper = document.getElementById('contacts-wrapper');
                                            await this.initContact(from);
                                            await this.loadNewContactThread(wrapper, from);                     // add a new chat in contacts page
                                        } 

                                        if (check2 == this.contacts[from].check) {                             // if user-specific check string is correct (2. Factor) 
                                            let internal = {                                                    // append new internal message
                                                time: new Date().getTime(),
                                                type: 'from',
                                                msg: msg
                                            }; this.contacts[from].stack.push(internal);
                                            if (!this.sounds.mute){                                             // decide on new message sound
                                                this.playSoundFor(msg)
                                            }
                                            if (this.chatVisible && this.toAddress == from) {                   // decide wether to build a blob in chat or increment the unread tag
                                                this.blob(internal, true);
                                            } else {
                                                this.newUnreadMessage(from);
                                            }
                                        } else {
                                            // failed to decrypt check string
                                            console.log('Wrong client check string found in pkg.')
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
            this.sounds.boom = new Audio('./media/boom.mp3')
            this.sounds.quick = new Audio('./media/quick.mp3')
            this.sounds.haha = new Audio('./media/haha.mp3')
            this.sounds.thx = new Audio('./media/dm.mp3')
            this.sounds.sk = [
                new Audio('./media/sk/sk_1.mp3'),
                new Audio('./media/sk/sk_2.mp3'),
                new Audio('./media/sk/sk_3.mp3'),
                new Audio('./media/sk/sk_4.mp3'),
                new Audio('./media/sk/sk_5.mp3')  
            ];
        },
        keyExport: async function (cryptoKey) {
            const exported = window.crypto.subtle.exportKey(
              "jwk",
              cryptoKey
            );
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
            this.settingsVisible = false;
            let frame = document.getElementById('messageFrame');
            frame.innerHTML = "" // flush

            // draw current aes key for this session
            this.encryption.aes.currentAESkey = this.contacts[address].aesBuffer; //await this.decrypt(this.contacts[address].aesBuffer);

            // load messages from the current stack
            let stack = this.contacts[address].stack;
            for (let i = 0; i < stack.length; i++) {
                await this.blob(stack[i], false)
            }

            // decide on 2nd factor lock fill in navi
            const lock = document.getElementById("lock-button"); 
            if (this.contacts[address].check != this.checkStringDefault) {
                try {
                    lock.classList.remove('lock-light');
                } finally {
                    this.displayAddress = 'secret';
                    lock.classList.add('lock-heavy'); 
                }
            } else {
                try {
                    lock.classList.remove('lock-light');
                } finally {
                    this.displayAddress = address.slice(0,7);
                    lock.classList.add('lock-light'); 
                }
            }

            this.scrollToBottom();
            this.noUnreadMessages(address);
        },
        loadCheckStringField: async function () {

            const navCols = Array.prototype.slice.call(                             // gather array of all columns in the chat navi
                document.getElementsByClassName("navi-flex-column") )
            navCols[0].style.maxWidth = "0px";                                           // respan the navi columns
            navCols[1].style.maxWidth = "0px";
            navCols[2].style.width = "100%";
            navCols[0].style.opacity = "0";
            navCols[1].style.opacity = "0";
            
            const lock = document.getElementById("lock-button");                    // shift the lock button to the left
            lock.style.right = "auto";
            lock.style.left = "5%";

            const inputField = document.createElement('input');                     // create the input field
            inputField.className = "client-check-input bisque-foreground";
            inputField.placeholder = "custom authentic secret";
            inputField.type = "password";
            lock.parentElement.appendChild(inputField)
            inputField.focus();

            function defaultLayout() {                                              // reshape the navi columns to normal
                inputField.remove()
                lock.style.right = "10%";
                lock.style.left = "";
                navCols[0].style.maxWidth = "";                                        
                navCols[1].style.maxWidth = "";
                navCols[0].style.opacity = "1";
                navCols[1].style.opacity = "1";
                navCols[2].style.width = "";
                this.displayAddress = 'secret';
            }

            inputField.onfocusout = function () {
                defaultLayout()
            }
            inputField.onkeydown = function(e) {
                if (e.which == 13) {
                    try {
                        noledger.contacts[noledger.toAddress].check = e.target.value;
                        defaultLayout();
                        lock.classList.remove('lock-light');
                        lock.classList.add('lock-heavy');
                        noledger.displayAddress = 'secret';
                        noledger.notify(
                            "Successfully applied new specific check string. Make sure that your chat partner applies the same.");
                    } catch (error) {
                        noledger.notify("Failed to set custom check string.");
                        noledger.displayAddress = address.slice(0,7);
                        console.log(error);
                        defaultLayout();
                    }
                } 
            };
        },
        loadContactsPage: async function () {
            let wrapper = document.getElementById('wrapper');

            // build the self address bar
            let addressHeader = document.createElement('div');
            let address_raw = await this.getAddress();
            address = address_raw.slice(0,9);
            addressHeader.innerHTML = `<div id="generate" class="row no-gutters dark-blue-foreground">
                <h3 id="address" class="col-sm">address: ${address}...</h3><h3 id="settings-button" class="col-sm" onclick="noledger.openSettings()"><img id="settings-icon" src="./media/gear.svg"></h3>
            </div>`;
            wrapper.appendChild(addressHeader);
            el = document.getElementById('address');
            el.zIndex = 0;
            el.onmouseover = function () {
                console.log('copied')
                span = document.createElement('span');
                span.id = 'address-tooltip';
                span.className = 'blue-foreground dark-blue-background';
                span.innerHTML = 'copy';
                span.zIndex = 100;
                this.parentElement.appendChild(span);
                this.className = "dark-blue-outline"
            }
            el.onmouseout = function () {
                this.className = "";
                document.getElementById('address-tooltip').remove();
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
        loadEmoji: async function (string) {
            this.writeInput(string);
            document.getElementById('entryInput').focus()
            document.getElementById('emojiFrame').scrollTop = 0;
            this.emojiVisible = false;
        },
        loadNewContactButton: async function (parent) {
            let el = document.createElement('span');
            el.className = 'contact-box highlight-foreground dark-blue-background clickable';
            el_payload = document.createElement('p');
            el_payload.innerHTML = "+ add contact";
            el.onmousedown = function () {

                // create address input
                //this.remove();
                //let el = document.createElement('span');
                this.innerHTML = ''
                this.className = 'contact-box';
                input_field = document.createElement('input');
                input_field.className = 'input-box';
                input_field.placeholder = 'enter address';
                this.appendChild(input_field);
                //parent.appendChild(el);

                // focus input field
                setTimeout(function () { input_field.focus(); }, 1)

                // reload contact button on out focus
                el = this;
                input_field.onfocusout = function () {
                    el.remove();
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
                            if (this.value != address || test) {
                                await noledger.initContact(this.value);
                                noledger.loadChat(this.value);
                                noledger.loadNewContactThread(document.getElementById('contacts-wrapper'), this.value);
                            } else {
                                this.value = '';
                                this.placeholder = 'cannot add your own address.'
                                await noledger.sleep(3);
                                this.placeholder = 'enter address';
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
            thread_box.className = 'contact-box highlight-foreground dark-blue-background clickable';
            thread_box.onmousedown = function () {noledger.loadChat(address)}
            el.appendChild(thread_box);

            // store address
            let addTag = document.createElement('address');
            addTag.style.display = 'none';
            addTag.innerHTML = address;
            thread_box.appendChild(addTag)
        },
        newUnreadMessage: async function (address) {
            /* Increments the unread variable of the contact. The contact needs to exist already. */
            // find the correct unread tag from threadBox
            let threadBox = Array.from(document.querySelectorAll('address')).filter(function (el) {
                return el.innerHTML === address
            })[0].parentElement;
            let unreadTag = threadBox.querySelector('div[class="unread"]');
            if (unreadTag) {
                this.contacts[address].unread += 1;
                unreadTag.innerHTML = this.contacts[address].unread;
                unreadTag.style.paddingLeft = "5px";
                unreadTag.style.paddingRight = "5px";
            }
        },
        notify: async function (message) {
            /* Overlay notification window */
            let span = document.createElement("span");
            let p = document.createElement("p");
            document.body.appendChild(span);
            span.appendChild(p);
            span.classList.add("notify-box");
            p.innerHTML = message;
            await this.sleep(.1);
            span.classList.add("notify-box-transparent");
            await this.sleep(3);
            span.classList.remove("notify-box-transparent");
            await this.sleep(1);
            span.remove();
        },
        notifyReadAndCallback: async function (message, callback, hidden=false, buttonLabel="submit", submitMessage="") {
            
            /*
            A function which notifies and parses an input which is 
            feeded into an arbitrary provided callback function.
                message: string
                callback: function
                hidden: boolean | For hiding passwords
            */

            // build notify box
            let span = document.createElement("span");
            let p = document.createElement("p");
            document.body.appendChild(span);
            span.appendChild(p);
            span.classList.add("notify-box");
            p.innerHTML = message;
            p.id = "notify-input-field";
            await this.sleep(.1);
            span.classList.add("notify-box-transparent");
            
            // add an interactive input section
            if (hidden) {
                span.innerHTML += '<input id="notify-input-field" type="password">'
            } else {
                span.innerHTML += '<input id="notify-input-field">'
            }
            span.innerHTML += '<button id="notify-submit-button"></button>'
            await this.sleep(.05); // give DOM 50ms time to parse new children
            const inputField = document.getElementById('notify-input-field');
            const button = document.getElementById('notify-submit-button');
            button.innerHTML = buttonLabel;
            inputField.focus();

            // add the callback to the button
            button.onmousedown = async function () {
                callback(inputField.value);
                if (submitMessage.length != 0) {
                    document.getElementById("notify-input-field").innerHTML = submitMessage;
                    await noledger.sleep(2);
                }
                span.classList.remove("notify-box-transparent");
                await noledger.sleep(1);
                span.remove();
            }
            
        },
        noUnreadMessages: async function (address) {
            /* Increments the unread variable of the contact. The contact needs to exist already. */
            // find the correct unread tag from threadBox
            let threadBox = Array.from(document.querySelectorAll('address')).filter(function (el) {
                return el.innerHTML === address
            })
            if (threadBox.length > 0) {
                threadBox = threadBox[0].parentElement;
                let unreadTag = threadBox.querySelector('div[class="unread"]');
                if (unreadTag) {
                    this.contacts[address].unread = 0;
                    unreadTag.innerHTML = '';
                    unreadTag.style.paddingLeft = "0px";
                    unreadTag.style.paddingRight = "0px";
                }
            }
        },
        openSettings: async function () {
            this.settingsVisible = true;
            this.chatVisible = false;
            this.wrapperVisible = false;
        },
        ping: async function () {
            this.send('🏓')
        },
        playSoundFor: async function (msg) {
            if (msg.includes('#skrr')) {
                let pool = this.sounds.sk;
                pool[Math.floor(Math.random()*pool.length)].play()
            } else if (msg.includes('#boom')) {
                this.sounds.boom.play()
            } else if (msg.includes('#quick') || msg.includes('#math')) {
                this.sounds.quick.play()
            } else if (msg.includes('#haha')) {
                this.sounds.haha.play()
            } else if (msg.includes('#thx')) {
                    this.sounds.thx.play()
            } else {
                this.sounds.inbox.play()
            }
        },
        regenerateAES: async function () {
            /* Generate new AES keys for every contact */
            const btn = document.getElementById("regenerate-AES-button");
            btn.innerHTML = "working ..."
            await this.sleep(.5);
            for (let address in this.contacts) {
                const phrase = await this.generateRandomBytes(16); 
                this.contacts[address].aesBuffer = await this.generateAESkeyFromPhrase(phrase);
            }
            btn.innerHTML = "done."
            await this.sleep(1);
            btn.innerHTML = "Generate"
            this.notify('Successfully generated new AES keys for all contacts.')
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
                } else if (word.includes('#skrr') || word.includes('#boom') || word.includes('#quick') || word.includes('#math') || word.includes('#haha')
                || word.includes('#thx')) {
                    let slicedWord = word.slice(1)
                    output += `<p style="color: #ebd03b; font-weight:bold;" target="_blank">${slicedWord}!</a>`;
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
                    reject({'errors': ['error during request: no connection']})
                }
                xhr.send(JSON.stringify(options)); 
            });
        },
        restoreAccountFromFile: async function () {
            let source,
            input = document.crea;

            document.querySelector('input[type="file"]').addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    var input = document.querySelector('input');
                    
          
                    source = URL.createObjectURL(this.files[0]); // set src to blob url
                }
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
                check = await this.encrypt(this.checkString, key);                      // asymmetrically encode general check string and credentials for tracking
                check2 = await this.encrypt(this.contacts[address].check, key);              // encrypt specific user client string
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
            
            pkg = {
                header: buf2str(check),
                check: buf2str(check2),
                from: from,
                cipher: cipher,
                phrase: buf2str(phrase),
                time: new Date().getTime(),
            }

            if (!this.sounds.mute) {this.sounds.send.play()}                            // play a send sound

            internal = {msg: msg, time: timestamp, type: 'to' };                        // append another pkg suited for client chat window
            this.contacts[address].stack.push(internal);

            this.blob(internal, fresh=true);                                            // build & load blob msg window

            let response = await this.request(pkg, '/submit');                          // send pkg to API

            this.emojiVisible = false;                                                  // toggle off emoji frame and scroll back
            document.getElementById('emojiFrame').scrollTop = 0;
        
        },
        sleep: function (seconds) {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve(0);
                }, 1000*seconds);
            });
        },
        toggleEmojiFrame: function () {
            this.emojiVisible = !this.emojiVisible
        },
        thumbnail: async function (url, anchor=null) {

            /* This function builds an interactive thumbnail element for showcasing websites */
            let candidate, domain, extractedTitle, protocol;
                tn = document.createElement('div');
            tn.className = "thumbnail-container";
            if (url.includes('www.youtube.com/')) { // check for youtube link to embed
                
                candidate = await this.youtube(url);
                candidate.className = "thumbnail-youtube";
                tn.appendChild(candidate);

            } else { // otherwise search for reference picture

                /* fetch the url provided */
                var response = await fetch(url);

                /* extract protocol and domain */
                if (url.includes('https')) {
                    protocol = 'https://'
                } else {
                    protocol = 'http://'
                } domain = url.replace(protocol,'').split('/')[0];

                /* Extract html object */
                rawHtml = await response.text();
                const parser = new DOMParser();
                let dom = parser.parseFromString(rawHtml, "text/html").documentElement;
                let body = dom.querySelector('body');

                // extract demanded data from dom object
                extractedTitle = dom.getElementsByTagName('title')['0'].innerHTML;
                
                /* pick a suitable image candidate */
                
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
                            await this.sleep(0.04)
                            if (img_el.height >= 100) { 
                                candidate = img_el;
                                candidate.className = "thumbnail";
                                break;
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    if (candidate) {break}
                }

                console.log('candidate', candidate)
                
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
                console.log('candidate', candidate)
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
                    tn.appendChild(favicon);
                }
            }
            
            if (anchor) {
                anchor.appendChild(tn);
            }
            this.scrollToBottom()
            return tn
        },
        writeInput: async function (string) {
            /* writes a string into entry input field */
            const el = document.getElementById('entryInput');
            el.value = el.value + string;
        }, 
        youtube: async function (url) {
            const embedUri = url.replace('watch?v=', 'embed/');
            let dom = `<iframe src="${embedUri}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            var doc = await new DOMParser().parseFromString(dom, "text/html");
            console.log('doc', doc.body.firstChild)
            console.log('uri', embedUri)
            //let iframe = document.createElement('iframe');
            //iframe.setAttribute("src", embedUri);
            return doc.body.firstChild
        },
    }
});
/* ---------------------------- */