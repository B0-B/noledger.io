# Peer-to-Peer
A physical peer-to-peer network would require data to flow directly between arbitrary node pairs without the need of a third party. But in central public ledger protocols this is broadly misunderstood as there is not a real transfer between nodes, instead a central instance takes transfer orders as input and subsqeuently adjusts the balances linked to receiver and sender addresses within the ledger. The final balance whihc may be reconstructed publicly emits the illusion of an end-to-end flow. The third party concept persists throughout different topologies which all involve server communication but may vary in their consesus in order to offer unique security standards. The most popular approach to avoid ledger manipulations utilizes the strength and variety of the network through distribution. The electronic cash system proposal by Satoshi Nakamoto is also often misinterpreted in regards of peer-to-peer as there are no tokens which are exchanged between nodes. Instead, oders are broadcasted to validator and miner nodes to confirm and prove transactions, respectively. Once the network agrees to the longest chain which resembles the proven ledger history the transactional accounting however applies in similar fashion as described in a centralized system. This system is another peer-to-peer illusion, but with the difference that the consesus does not rely on trust towards a single party but on proof-of-work which is distributed democratically across the network. 


# The Problem of Anonimity
To reach consensus blockchains require a bijective mapping between each entry and the corresponding stakeholders, which is associated with the proof of identities using an asymmetric crypto system which removes the byzantine fault. This creates a problem by design, in which anonimity can not pe guaranteed. Even without a map between user identities and wallet addresses the transactions can be classified and reconstructed to a relational net of wallets. Apparently, this prevents the anonimity between communicators as it promotes attackers to route every exchange. Although solutions were presented which successfully implement ring signatures to solve this issue, they are based on obfuscation and computational infeasability.    


Distributed networks protect from manipulation but actually not conveniently (perfectly by design) from tracking and routing. Chain analysis tools allow to map a pseudo anonymous address and can reconstruct the whole history since creation, like anyone else since it is public. The modern concept of secure messaging demands a buffer for messages while a client is disconnected, a third party seems inevitable for this service. Although messages are managed by a central instance, this concept can be designed in a distributed manner: namely where the chain itself would serve as a buffer and clients are filing messages on to the ledger and read every entry from the ledger. This would prefer latency and conveniently hold the anonimity, but would need improvements in scaling as the entire traffic is handled by a single host.


In a star topology the central node can quickly become a target for attacks. Sniffing and data mining have become very attractive - e.g. companies which host services may collect plenty of information throughout end-to-end encrypted conversations. Meta data help to reconstruct the whole network with all it's clients' activities. This allows to extract a relational model by classification. Anyway in a routing prohibited protocol, the vulnerability would include stability and service convenience but not the security in the sense that messages or routes would be exposed in any way. This supports to the interest of attackers as there are no personal information one could extract.

Hence, for a secure messaging system whose protocol prohibits hosts from saving meta data, a star topology becomes more attractive over a distributed one, since the message encryption is not enhanced through further decentralization except for the networks stability or reliability but with the cost of latency. Recall that in a centralized system manipulations become easier to achieve. 

Preservation of anonimity can be met by a service if it obeys the following protocol.

<br>

# Protocol

## I) Trusted Identification
Every client is identified by a unique RSA key pair where the public key serves as the client's address (the holder of the address) and is used for asymmetric encryption processes. No one in, nor outside the network knows that an address exists, except apparently the holder and his/her contacts. Clients with access to an address, other than their own, share the ability to contact the holder and subsequently vice versa.



## II) Key Exchange
### II.1) Diffie-Hellmann Channel
To enable a connection between two clients, one of them must initially posses the address of the other. The channel must at least be able to exchange RSA public keys of demanded length.

### II.2) Exchange Completion
The key exchange is completed after the first message is successfully transmitted, which in it's plain form yields the senders address for the receiver.

## III) The Ledger
The ledger in this protocol is public, centralized and non-persistant.

### III.1) Anonimity through Publicity
The ledger is served publicly. Every client can add entries to the ledger. Every client can access all ledger entries. From the ledger it is not possible to record, reconstruct or track mututal connections, identities or their history of activities. 

### III.2) Tracking of Entries
Entries are appended in chronological order. An identification number (ID) is assigned bijectively to each entry.

### III.3) Non-Persistency
Other than the general definition, entries have a life-time within the ledger. When an entry expires it is removed from the ledger in reverse order. 

### III.3.1) Lifetime Adaption
To releave the system from high traffic the lifetime can be adjusted such that high traffic and frequent activity may influence it indirectly.

## IV) Entries
Entries are child objects of the ledger described in III and contain the exchanged information in encrypted form.

### IV.1) Format
Most of the secured exchange and hidden routing between clients is enabled by the entry format, the rest is handled by the exchange mechanics outlined in V. Entries are filed to the ledger in the format below. 
    
| Entry  | Content | Type | Description |
|---|---|---|---|
|   | header | String | Check string encrypted with receivers address  |
|   | from | String | The senders public address sym. encrypted with AES key |
|   | cypher | String | The senders message encrypted with AES key |
|   | key | String | Symmetric AES key for the entry (contact specific) encrypted with receivers address |
|   | time | Integer | Ledger entrance timestamp in plain text |   


## V) Clients

### V.1) Initialization
Clients are anonymous and do not share any activity with the host. The identification described in I) is performed locally. 

### V.2) Route Obfuscation
Every active participant (client) needs to request each ledger entry in its encrypted form and try to decrypt exclusively on the client side. This maximizes the relational entropy between clients and prevents any feedback about the decryption success.

### V.3) Ledger Reading
Entries are requested by the client by sending the last observed ledger id to the central node. The returned package will contain all entries between the last id observed by the client and the last id received by the ledger. The last observed id is updated by the highest id in the returned set.

### V.4) Entry Decryption
Every entry contained in the node response is tried to be decrypted with the requester's private key. The success is determined from decrypting the header and comparing to the check string to upon which all clients or a subset of them have agreed to. On inequality the entry is discarded while on success the rest of the entry is decrypted in the order 
1. Decrypt the provided AES key using the private key
2. Use the decrypted AES key to further decrypt the sender's address
3. Use the AES key to decrypt the cypher with the message yield
