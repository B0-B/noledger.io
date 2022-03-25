# Protocol Proposals and Development

<h2><strong>Client-Specific Check String</strong></h2>
The header check string is used to test the decryptability of a package, but the same method can be used as a second factor for authenticity checks or to block spam. For this two participants that share a secret (word, number, etc.) can send it in encrypted form to the ledger. Messages (entries) which are downloaded from the ledger might be decryptable and show the correct receiver address, but in order to authenticate must also yield the client specific check string, otherwise the entry will be discarded. Spam attacks could be filtered, but also this second check string can be invoked to block a conversation i.e. changing the client-specific check string without letting anyone know. The spec. check string is by default initialized in the same way as the default header check string. Two client can be reached by another client if his address is known and their client-specific check strings match.
<br><br>

<h2><strong>Random Padding</strong></h2>
If the check string or the senders address is encrypted with the same public key it would yield the same cipher every time (since the payloads are constant) which allows classifying messages to groups that originated from unknown addresses. To overcome this and to add another pbfuscation layer, a padding is added at the end of each payload. For this the usual encrypt/decrypt functions are modified such that

for encryption

1. A random 8 Byte string is generated in ascii and appended to the payload (plain text)
2. The result from 1. is encoded to bytes
3. Encrypt the bytes obtained in 2. with the public key.

and for decryption 
1. Decrypt the array buffer to plain text using the private key
2. from the result in 1. remove the last word
3. The result obtained in 2. is the plain text

The modified functions should be used for all encryption/decryption processes.
<br><br>

<h2><strong>Base Protocol</strong></h2>

A secure and anonymous ledger-based messaging protocol. 

See the [full paper](https://github.com/B0-B/noledger/blob/main/docs/core/paper.md).