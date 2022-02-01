# Peer-to-Peer
A physical peer-to-peer network would require data to flow directly between arbitrary node pairs without the need of a third party. But in central public ledger protocols this is broadly misunderstood as there is not a direct transfer between nodes, instead a central instance takes transfer orders as input and subsqeuently adjusts the balances linked to receiver and sender addresses within the ledger. The balances which may be accounted publicly emit the illusion of an end-to-end flow of information. The third party concept persists throughout different topologies which all involve server communication but may vary in their consesus in order to offer unique security standards. The most popular approach to avoid ledger manipulations utilizes decentralization. The electronic cash system proposal by Satoshi Nakamoto is also often misinterpreted in regards of peer-to-peer as tokens are not exchanged directly between nodes, nor do they exist. Instead, oders are broadcasted to validator and miner nodes, distributed third parties which hold a copy of the ledger, to confirm and prove transactions, respectively. Once the network agrees to the longest chain which resembles the proven ledger history the transactional accounting however applies in similar fashion as described in a centralized system. A distributed ledger creates a peer-to-peer illusion, but with the difference that the consesus does not rely on trust towards a single party but on proof-of-work which is distributed democratically across the network. 


# The Problem of Anonimity
To reach consensus a ledger would require a non-injective, non-surjective mapping between each entry and its stakeholders. The identity proof is associated with an asymmetric crypto system to remove the byzantine fault. This creates a problem by design as pseudo-anonymous addresses are publicly exposed for the sake of the mechanism by which anonimity is not preserved. Even without a map between user identities and wallet addresses the transactions can be classified and reconstructed to a relational net, promoting attackers to route exchanges. Although solutions were presented which successfully implement ring signatures to solve this issue, they are based on obfuscation and computational infeasability, not to mention the work which is required to enable them. Distributed networks protect from manipulation but actually not conveniently (by design) from tracking and routing. Anonymous routes are crucial for absolute privacy between two participants and are not (and should not be) provable by others and hence do not demand consensus. We denote that a system which does not require work or proof to confirm commits invites for spam and denial, different from a centralized system in which manipulations become easier to achieve. 

# A Central Ledger

Besides the security aspects modern messaging concepts demand a buffer to store messages (MITM) while a receiver is disconnected. So far third parties seemed inevitable for this and mark potential risks as they are generally expected to exploit the network. Fortunately this middle man can be turned into a zombie - a state in which it is always assured by protocol that the third party will serve and has no relatable (and thus exploitable) data to work with. The zombie is also powerless on the routing which is not (and cannot be) managed by him since he does not know to whom the entries belong. Instead, the routing is accomplished by the anonymous exchange mechanism which enables a client to trust any central host (zombie), even corrupted ones as the provided packages cannot be used against him. Finally the central node acts as a trustworthy API which receives and displays entries in chronological order to form the ledger.
In a star topology the central node can quickly become a target for internal but also external attacks. An attacker who controls the zombie will face the same issues when sniffing, however he is able to delete entries or to denial the service from outside i.e. he could (only) cut the information channel.

# Routing and Entropy
although the ledger is already managed by a central instance it is still distributed across the network. In this scenario the decentralization is used to create relational entropy and not to prevent from manipulating the ledger as a manipulation could not harm the privacy between clients, nor expose their identities. Further, it is not possible to classify any entry to extract any meta data that could relate to any client or exchange. 

The ledger itself would serve as a buffer and clients would commit messages as entries onto it and simultaneously read every entry from it - this is equivalent to a ledger distribution, except that there is no feedback, neither node-to-node nor node-to-server. Not all received entries from the ledger will be readable but only those which can be encrypted by the receiving client. This would prefer latency and respect anonimity, not by infeasability but by maximized relational entropy. The central node 

# Shooting 
 Service hosts may collect plenty of information throughout end-to-end encrypted conversations through data sniffing and mining. Meta data could reveal internal network activities, information about clients etc. Anyway, in a routing prohibited protocol the vulnerabilities include stability and service convenience but not the security in the sense that messages or routes would be exposed in any way. This would preserve the absolute privacy at any time and should minimize any attacker's interest due to unrelatable data.



For a secure messaging system whose protocol prohibits hosts from saving meta data, a star topology becomes naturally attractive over a decentralized one. Especially as the message encryption is not enhanced through further decentralization except for the networks stability or reliability. 

Preservation of anonimity can be assured by a service if it obeys the following protocol.

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
The identification described in I) is performed locally. Clients identify anonymously without any exchange with the server.

### V.2) Routing Entropy
Every active participant (client) needs to request each ledger entry in its encrypted form and try to decrypt exclusively on the client side. This maximizes the relational entropy between clients and prevents any feedback about the decryption success.

### V.3) Ledger Reading
Entries are requested by the client by sending the last observed ledger id to the central node. The returned package will contain all entries between the last id observed by the client and the last id received by the ledger. The last observed id is updated by the highest id in the returned set.

### V.4) Entry Decryption
Every entry contained in the node response is tried to be decrypted with the requester's private key. The success is determined from decrypting the header and comparing to the check string to upon which all clients or a subset of them have agreed to. On inequality the entry is discarded while on success the rest of the entry is decrypted in the order 
1. Decrypt the provided AES key using the private key
2. Use the decrypted AES key to further decrypt the sender's address
3. Use the AES key to decrypt the cypher with the message yield
