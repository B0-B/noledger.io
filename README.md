<h2 align=center><strong>noledger</strong></h2> 

A secure messaging protocol influenced by public ledger technology. Chat clients connect through Diffie-Hellman key exchange and messages are broadcasted publicly in RSA cipher form and can be decrypted only by those who own a private key which corresponds to their address (public key). This improves standard e2e security protocols as there are no sender, nor receiver nodes to which encrpyted packages can be traced back. 

Read the full [article](https://github.com/B0-B/noledger/blob/main/docs/paper.md).


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