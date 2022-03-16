# Protocol Proposals and Development
The following documentation outlines and archives all noledger proposals, their current status of investigation/implementation and their corresponding release version. Every new proposal obtains a proposal ID and needs proper testing before considering further engagement. After successful `validation` the proposal status changes to `pending` and is assigned to an upcoming release version. The status sequence from there is `in progress`, `testing`, `stable` or just directly `failed`.

| Function | Description | Status | Protocol Version | 
|---|---|---|---|
| Spam Infeasability | A client-side PoW ansatz intended to protect the ledger from massive spam. | Validation | - |
| Image Transfer | Secure image exchange ability using RGB reconstruction to avoid original meta data leakage. | Pending | v-1.1.0 |
| Signatures | Replace check strings crypto signatures. | Pending | v-1.1.0 |
| Random Padding | Randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | Stable | v-1.0.0 | 
| Base Protocol | A secure and anonymous ledger-based messaging protocol.  | Stable | v-1.0.0 |

<br><br>

<h2><strong>Random Padding</strong></h2>
<h3 align=center><strong>Description</strong></h3>
If the check string or the senders address is encrypted with the same public key it would yield the same cipher every time (since the payloads are constant) which allows classifying messages to groups that originated from unknown addresses. To overcome this and to add another pbfuscation layer, a padding is added at the end of each payload. For this the usual encrypt/decrypt functions are modified such that

for encryption

1. A random 8 Byte string is generated in ascii and appended to the payload (plain text)
2. The result from 1. is encoded to bytes
3. Encrypt the bytes obtained in 2. with the public key.

and for decryption 
1. Decrypt the array buffer to plain text using the private key
2. from the result in 1. remove the last word
3. The result obtained in 2. is the plain text
<br><br>

<h2><strong>Base Protocol</strong></h2>
<h3 align=center><strong>Description</strong></h3>

A secure and anonymous ledger-based messaging protocol. 

See the [full paper](https://github.com/B0-B/noledger/blob/main/docs/core/paper.md).