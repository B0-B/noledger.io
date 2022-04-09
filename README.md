<h2 align=center><strong><a ref="noledger.io">noledger.io</a></strong></h2> 

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=A%20secure%20and%20anonymous%20messaging%20service%20based%20on%20a%20public%20ledger%20protocol.&url=https://github.com/B0-B/noledger.io&hashtags=noledger,secure,ledger,messenger)

A secure and anonymous messaging service based on a public ledger protocol. Clients connect through Diffie-Hellman key exchange and broadcast their messages publicly in a central ledger (ciphered) which is subsequently requested by every client that synchronizes with the ledger, but can be decrypted only locally by those who own a private key which is associated to the address (public key). There are no sender, nor receiver nodes to which encrpyted packages can be traced back. Users do not have to raise any concerns towards the service host, even if it is corrupt. 

Read the full [article](https://github.com/B0-B/noledger/blob/main/docs/core/paper.md).

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

## [Core Protocol Development](https://github.com/B0-B/noledger/blob/main/docs/development/development.md)
| Function | Description | Status | Protocol Version | 
|---|---|---|---|
| Secure File Relay | A secure way to exchange files using the messenger. | Pending | v-1.1.0 |
| Long-term Accounts | A function which enables clients to download/save their whole account encrypted in a file and can be reconstructed in any browser. | Stable | v-1.1.0 |
| Specific Check String | A second, contact specific check string for authenticity proof. | Stable | v-1.0.0 |
| Random Padding | Randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | Stable | v-1.0.0 | 
| Base Protocol | A secure and anonymous ledger-based messaging protocol.  | Stable | v-1.0.0 |

<br>

## Setup
Run the setup script in the root directory
```bash
bash setup.sh
```
then open the certificate path
```bash
cd ./cert/self_signed
```
and generate a new certificate via
```bash
bash create.sh # follow instructions
```
or store a valid certificate and key as `ssl.crt` and `ssl.key`, respectively.

<br>

## Start the noledger node
The default port will be 443
```bash
sudo node server
```

otherwise a port can be provided via command line argument
```bash
sudo node server 3000 # start the node on port 3000
```

For the default port open https://localhost in the browser. Access the web client by pressing the button on the landing page.

<br>


## Standards

