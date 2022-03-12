# Protocol Proposals and Development
The following documentation outlines and archives all noledger proposals, their current status of investigation/implementation and their corresponding release version. Every new proposal obtains a proposal ID and needs proper testing before considering further engagement. After successful `validation` the proposal status changes to `pending` and is assigned to an upcoming release version. The status sequence from there is `in progress`, `testing`, `stable` or just directly `failed`.

| Function | Description | Status | Protocol Version | Proposal ID |
|---|---|---|---|---|
| Spam Infeasability | A client-side PoW ansatz intended to protect the ledger from massive spam. | Testing | - | |
| Random Padding | A randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | Pending | v-1.1.0 | |
| Image Transfer | A secure image exchange ability using RGB reconstruction to avoid original meta data leakage. | Pending | v-1.1.0 | |
| Base Protocol | A secure and anonymous ledger-based messaging protocol.  | Stable | v-1.0.0 | np-0 |

<br><br>

<h2><strong>Base Protocol [np-0]</strong></h2>
<h3 align=center><strong>Description</strong></h3>

A secure and anonymous ledger-based messaging protocol. 

See the [full paper](https://github.com/B0-B/noledger/blob/main/docs/core/paper.md).