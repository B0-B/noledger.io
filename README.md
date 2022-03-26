<h2 align=center><strong><a ref="noledger.io">noledger.io</a></strong></h2> 

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=A%20secure%20and%20anonymous%20messaging%20service%20based%20on%20a%20public%20ledger%20protocol.&url=https://github.com/B0-B/noledger.io&hashtags=noledger,secure,ledger,messenger)

A secure and anonymous messaging service based on a public ledger protocol. Clients connect through Diffie-Hellman key exchange and messages are broadcasted publicly in a central ledger (ciphered) and are requested by every client which syncronizes with the ledger, but can be decrypted only by those who own a private key which corresponds to their address (public key). There are no sender, nor receiver nodes to which encrpyted packages can be traced back. 

Read the full [article](https://github.com/B0-B/noledger/blob/main/docs/core/paper.md).

---

## [Project & Protocol Development](https://github.com/B0-B/noledger/blob/main/docs/development/development.md)
| Function | Description | Status | Protocol Version | 
|---|---|---|---|
| Image Transfer | Secure image exchange ability using RGB reconstruction to avoid original meta data leakage. | Pending | v-1.1.0 |
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

To specify the port provide a CL argument
```bash
sudo node server 3000 # start the node on port 3000
```

For the default port open https://localhost in the browser.

<br>

## API
Every node hosts two endpoints `localhost/submit` (writing) and `localhost/ledger` (reading). It is possible to develop a custom client to read from and submit messages to the ledger via JSON HTTP request.
```nodejs
pkg = {
    header: "Array Buffer of encrypted check string header",
    check: buf2str(check2),
    from: from,
    cipher: cipher,
    phrase: buf2str(phrase),
    time: new Date().getTime(),
}
```

