<h2 align=center><strong>noledger</strong></h2> 

A secure messaging service based on a public ledger protocol. Chat clients connect through Diffie-Hellman key exchange and messages are broadcasted publicly in RSA cipher form and are requested by every client but can be decrypted only by those who own a private key which corresponds to their address (public key). There are no sender, nor receiver nodes to which encrpyted packages can be traced back. 

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

## Project & Protocol Development Overview
| Function | Description | Status | Protocol Version | Proposal ID |
|---|---|---|---|---|
| Spam Infeasability | A client-side PoW ansatz intended to protect the ledger from massive spam. | Testing | - | |
| Random Padding | A randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | Pending | nv-1.1.0 | |
| Image Transfer | A secure image exchange ability using RGB reconstruction to avoid original meta data and self destruction. | Pending | nv-1.1.0 | |
| Base Protocol | Noledger exchange protocol implementation. | Pending | nv-1.1.0 | |

