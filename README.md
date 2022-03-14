<h2 align=center><strong><a ref="noledger.io">noledger.io</a></strong></h2> 

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=A%20secure%20and%20anonymous%20messaging%20service%20based%20on%20a%20public%20ledger%20protocol.&url=https://github.com/B0-B/noledger.io&hashtags=noledger,secure,ledger,messenger)

A secure and anonymous messaging service based on a public ledger protocol. Clients connect through ext. Diffie-Hellman key exchange and messages are broadcasted publicly in a central ledger (ciphered) and are requested by every client which syncronizes with the ledger, but can be decrypted only by those who own a private key which corresponds to their address (public key). There are no sender, nor receiver nodes to which encrpyted packages can be traced back. 

Read the full [article](https://github.com/B0-B/noledger/blob/main/docs/paper/paper.md).


## Setup
Run the setup script in the root directory
```bash
bash setup.sh
```

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

## [Project & Protocol Development](https://github.com/B0-B/noledger/blob/main/docs/development/development.md)
| Function | Description | Status | Protocol Version | Proposal ID |
|---|---|---|---|---|
| Spam Infeasability | A client-side PoW ansatz intended to protect the ledger from massive spam. | Validation | - | |
| Image Transfer | Secure image exchange ability using RGB reconstruction to avoid original meta data leakage. | Pending | v-1.1.0 | |
| Random Padding | Randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | Stable | v-1.0.0 | np-1 |
| Base Protocol | A secure and anonymous ledger-based messaging protocol.  | Stable | v-1.0.0 | np-0 |

