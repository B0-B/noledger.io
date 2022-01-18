<h2 align=center><strong>noledger</strong></h2> 

A secure messaging service protocol influenced by public ledger technology. Chat clients connect through Diffie-Hellman key exchange and messages are broadcasted publicly in RSA cipher form and can be decrypted only by those who own a private key which corresponds to their address (public key). This improves standard e2e security protocols as there are no sender, nor receiver nodes to which encrpyted packages can be mapped to, resulting in maximized relational entropy within the network and hence ensuring plausible deniability.

## Start the noledger node
```bash
sudo node server
```