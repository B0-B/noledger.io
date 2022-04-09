# Protocol Proposals and Development

<h2><strong>Client-Specific Check String</strong></h2>
First attempts to create authenticity involved elliptic curve signatures which would enable every client to sign each message. The receiver at the other end, who posseses the senders public key is able to determine if the sender is in posession of the private key.

The upper method is very often used in most of the web-encrypted communication however it poses a threat but also does not solve the problem of real authenticity since:
- It is not advised in computer cryptography to use the same key pair for signing as for encryption. Instead a seperate key pair shall be generated - another keypair which has to be linked to the main one to ensure the signature is associated to an address. But this raises the question how to keep the track of mapping. Especially if keys (for security reasons) need to be exchanged.
- A signature does not verify that a message was truly sent by the user. Instead it just verifies that the user is in posession of the private signing key (which can be the decryption key or not). Apparently, hackers who can obtain access to that key i.e. steal it can sign (and if signing key and decryption key are the same read) every message and thus pretend to be someone else.

A much simpler and original solution is the sharing of relation-specific information, which is only known to both users - a secret - and thus cannot be fetched or copied so easily. Also no changes needs to be tracked, mapped etc. which makes it easy to quickly exchange the secret on behalf. The number of keys needed to be memorized will increase compared to the signature method but this pragmatic method raises the likelihood that messages which contain the secret originate truly from the desired sender.

The header check string is used to test the decryptability of a package, but the same mechanism can be used as a second factor for authenticity checks or to block spam. For this two participants that share a secret (word, number, etc.) can send it encrypted with the entry to the ledger. Messages (entries) which are downloaded from the ledger might be decryptable and show the correct receiver address, but in order to authenticate must also yield the client specific check string, otherwise the entry will be discarded. Spam attacks could be filtered, but also this second check string can be invoked to block a conversation i.e. changing the client-specific check string without letting anyone know. The spec. check string is by default initialized in the same way as the default header check string. Two client can be reached by another client if his address is known and their client-specific check strings match.
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