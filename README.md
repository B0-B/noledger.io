<h2 align=center><strong><a ref="noledger.io">noledger.io</a></strong></h2> 

<!-- Badges -->
<!-- twitter -->
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=A%20secure%20and%20anonymous%20messaging%20service%20based%20on%20a%20public%20ledger%20protocol.&url=https://github.com/B0-B/noledger.io&hashtags=noledger,secure,ledger,messenger)<!-- version --><a name="stealth"><img src="https://img.shields.io/badge/Release%20-1.2.0-cyan.svg"/></a>

A secure and anonymous messaging service based on a ledger protocol. Clients connect by exchanging addresses (Diffie-Hellman key exchange) and broadcast their ciphered messages publicly in a central ledger. Every client that synchronizes with the ledger is downloading each message but will be only able to decrypt it if he posesses the private key associated to the receiver's address. By the proposed protocol there are no sender nor receiver IPs to which encrpyted packages can be traced back. Users do not have to raise any concerns towards the service host, even if it is corrupt. 

Read the full [article](https://github.com/B0-B/noledger.io/blob/main/docs/core/paper.md).

### Checkout the deployed service at [noledger.cc](https://noledger.cc/)

<br>

## Features
noledger.io is the only messaging service which

- 🤲🏽 is completely free, liberal and avoids any KYC
- 📜 stores messages on a time-limited public ledger but respects integrity, authenticity and absolute anonimity through distributional entropy
- 🕵🏽‍♂️ prohibits the tracing of connections, routes or meta data by design and with mathematical/informational certainty 
- 🔐 can always be trusted if the client-side protocol is obeyed, even if the service is corrupt

---

## Why noledger was initiated in a table
The table below is a collection of publicly known security incidents (headlines and articles) with common E2E messaging services. 

| Date | Subject |
|---|---|
|2/15/2022|[European Commission justifies mass surveilance through child sex abuse - leaked internal statement.](https://edri.org/wp-content/uploads/2022/03/2022-03-21-csam-avis-rsb-15-fevrier.pdf)|
|9/8/2021|[Whatsapp end-2-end encryption is not private.](https://arstechnica.com/gadgets/2021/09/whatsapp-end-to-end-encrypted-messages-arent-that-private-after-all/)|
|6/19/2021|["Then in October 2019, WhatsApp revealed that journalists and human rights activists in India had been targets of surveillance by operators using Pegasus"](https://hydnews.net/2021/07/what-is-pegasus-surveillance-and-why-it-needed-full-and-unbiased-investigation/)|
|6/10/2021|[Germany passed new policy which allows authorities to utilize "governmental" trojans for mass surveilance.](https://www.spiegel.de/netzwelt/netzpolitik/bundestag-genehmigt-staatstrojaner-fuer-alle-a-d01006d4-a530-41c9-ad69-21a3990acfa8)|
---

<br>

## [Core Protocol & Development](https://github.com/B0-B/noledger.io/blob/main/docs/development/development.md)
| Function | Description | Status | Version | Proposal |
|---|---|---|---|---|
| Secure File Relay | A secure way to exchange files using the messenger. | Pending | - | - |
| Hidden Service | A secure way to exchange files using the messenger. | Pending | - | - |
| Adaptive Grouping | Automatic mechanism to protect clients from high traffic. | Stable |v-1.2.0 | 1.2.0 |
| Long-term Accounts | A function which enables clients to download/save their whole account encrypted in a file and can be reconstructed on any device. | Stable | v-1.1.0 | |
| Specific Check String | A second, contact specific check string for authenticity proof. | Stable | v-1.0.0 | - |
| Random Padding | Randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | Stable | v-1.0.0 | 1.0.0 |
| Base Protocol | A secure and anonymous ledger-based messaging protocol.  | Stable | v-1.0.0 | 1.0.0 |

<br>

## Patch Notes
| Release | Patch Notes|
|---|---|
|v-1.2.0| - new console logger for traffic monitoring <br> - Added adaptive grouping mechanism server and client-side to protect clients from high traffic <br> - Improved server-side cleaner perormance through mapping entry IDs to group IDs <br> - Added new traffic module for group determination <br> - Added new "screen lock" mechanism which triggers on inactivity and when leaving the app <br> - Removed release script and other legacies |
|v-1.1.0| - Fixed generate AES key issue - Receivers were not decrypting correctly after AES key exchange <br> - Fully implemented account saving and loading for long-term usage <br> - Improved UI interactivity <br> - Added release script in release/ directory <br> - Added version badge to README.md |


<br>

## IP Spoofing
Protecting the user IP goes beyond the capabilities of the node-side protocol and is probably the only action which lies in the user's hands and spans across all web services. It is thus highly recommended to hide the IP via VPN or TOR window (Brave Browser for example). Attackers still cannot break the encryption nor reveal the E2E route of fetched packages but may map them in ciphered form to the origin IP. SOCKS5 implementation for a hidden service is already in plan.

<br>

## Setup
Run the setup script in the root directory
```bash
bash setup.sh
```
open the certificate path and generate a new certificate (optional)
```bash
cd ./cert/self_signed
bash create.sh # follow instructions in terminal
```
or store a valid certificate and key as `ssl.crt` and `ssl.key`.

<br>

## Start the noledger node
The default port will be 443
```bash
sudo node server
```

otherwise a port can be provided via argument
```bash
sudo node server 3000 # start the node on port 3000
```

For the default port open https://localhost in the browser. Access the web client by pressing the button on the landing page.

<br>


## Standards

