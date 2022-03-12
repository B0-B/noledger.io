# Protocol Proposals and Development
The following documentation outlines and archives all noledger proposals, their current status of investigation/implementation and their corresponding release version. Every new proposal obtains a proposal ID and needs proper testing before considering further engagement. After successful `validation` the proposal status changes to `pending` and is assigned to an upcoming release version. The status sequence from there is `in progress`, `testing`, `stable` or just directly `failed`.

| Function | Description | Status | Protocol Version | Proposal ID |
|---|---|---|---|---|
| Spam Infeasability | A client-side PoW ansatz intended to protect the ledger from massive spam. | validation | - | |
| Random Padding | A randomly generated nonce that is appended to the plain text. This feature randomizes every cipher output to prevent classification of identical plain text samples that were encrypted with the same key. | pending | nv-1.1.0 | |
| Image Transfer | A secure image exchange ability using RGB reconstruction to avoid original meta data leakage. | pending | nv-1.1.0 | |
| Base Protocol | Base protocol implementation. | stable | nv-1.1.0 | np-0 |