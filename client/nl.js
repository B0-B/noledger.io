/*
==================================================================
noledger
Client-Side Code Copyright © 2022 noledger
Author: B0-B (alch3mist94@protonmail.com)
------------------------------------------------------------------

This code is licensed under

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
        checkString: 'noledger-checksum-plaintext',
        contacts: {},
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
        this.initListener();
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
        aesEncrypt: async function (plainText) {
            const encodedText = this.encryption.encoder.encode(plainText);
            const byteLength = this.encryption.aes.ivLength;    
            const iv = crypto.getRandomValues(new Uint8Array(byteLength));                               // generate a random 4096 bit or 16 byte vector
            const algo = { name: this.encryption.aes.algorithm, iv: iv };
            const key = await this.encryption.aes.currentAESkey;
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
        encrypt: async function (data, key) {
            const dataEncoded = await this.encryption.encoder.encode(data);
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
        decrypt: async function (cipher) {
            const dataEncoded = await crypto.subtle.decrypt(this.encryption.algorithm, this.keyPair.privateKey, cipher);
            let decoded = await this.encryption.decoder.decode(dataEncoded);
            return decoded
        },
        destroyLoadFrameDelayed: async function () {
            await this.sleep(1);
            document.getElementById('load-frame').remove()
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
                                        
                                        if (!this.sounds.mute){                                                // decide on new message sound
                                            this.playSoundFor(msg)
                                        }                        
        
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
            addressHeader.innerHTML = `<div id="generate" class="row no-gutters dark-blue-foreground">
                <h3 id="address">address: ${address}...</h3>
            </div>`;
            wrapper.appendChild(addressHeader);
            el = document.getElementById('address');
            el.zIndex = 0
            el.onmouseover = function () {
                console.log('copied')
                span = document.createElement('span');
                span.id = 'address-tooltip';
                span.className = 'blue-foreground dark-blue-background';
                span.innerHTML = 'copy';
                span.zIndex = 100;
                this.appendChild(span);
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

            let response = await this.request(pkg, '/submit');                          // send pkg to API

            this.emojiVisible = false;                                                  // toggle off emoji frame and scroll back
            document.getElementById('emojiFrame').scrollTop = 0;
        
            //this.entryCollapse()                                                        // minimize the entry field again
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
                tn.appendChild(favicon);
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
    }
});
/* ---------------------------- */