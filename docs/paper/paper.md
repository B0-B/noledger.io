# Peer-to-Peer
A physical peer-to-peer network requires data to flow directly between arbitrary node pairs without the need of a third party. But in central ledger protocols (bank) this is not the case as there is no direct transfer between nodes, instead a central instance takes transaction orders as input and subsqeuently adjusts the balances linked to receiver and sender addresses within the ledger. The balances which may be accounted publicly emit the illusion of end-to-end flows of information or value. The third party concept persists throughout different topologies which all involve server communication but may vary in their consesus in order to offer unique security standards. The most popular approach to avoid ledger manipulations utilizes decentralization. The electronic cash system proposal by Satoshi Nakamoto is also often misinterpreted in regards of "peer-to-peer" - tokens are not exchanged directly between nodes, nor do they exist. Instead, oders are broadcasted to validators and miners, distributed third parties which hold a copy of the ledger, to secure the network and to guarantee democratic decentralization with proof, respectively. Once the network agrees to the longest chain which resembles the proven ledger history the balance accounting will apply in equivalent fashion as described in a centralized system. A distributed ledger creates a peer-to-peer illusion, but with the difference that the consesus does not rely on trust towards a single party but on proof-of-work which can be gathered liberally across the network. The illusion of a third party is irrelevant in this concept as technically there is no flow of value at all which makes the protocol so nubile.


# The Problem of Anonimity
To reach consensus a ledger would require a non-injective and non-surjective mapping between each entry and its stakeholders. The identity proof that is associated with the byzantine fault is typically solved with an asymmetric crypto system which in fact creates a problem by design: pseudo-anonymous addresses are publicly exposed for the sake of the mechanism which does not preserve anonymity. Even without a map between user identities and addresses the transactions can be classified and reconstructed to a relational net, this promotes attackers to trace exchange routes to point to attackers. Although solutions were presented which successfully implement ring signatures to solve this issue, they are based on obfuscation and computational infeasability. Distributed networks protect from manipulation but actually not conveniently (by design) from tracking and routing. Anonymous routes among clients are crucial for absolute privacy and are not (and should not be) provable by others and hence do not demand consensus at all. One denotes that a system which does not require work or proof to confirm commits invites for spam and denial as in a centralized system manipulations become easier to achieve whereas the message encryption is not enhanced through further decentralization.


# A Central Ledger
Besides the security aspects modern messaging concepts demand modern features, a crucial one is a buffer to store messages (MITM) while the receiver is disconnected. So far, third parties seemed inevitable for this job but also mark potential risks and red flags as they might (and should) be expected to exploit the network. For instance sniffing and data mining have become generic and standard among hosts which may collect plenty of information throughout end-to-end encrypted conversations through meta data. There have been rivers of incidents over the past decades that probably reveal only the tip of the ice berg in which faulty middle-men have not served their network but expoited it directly or indirectly.

Fortunately this middle man can be turned into a "zombie" - a state in which it is always assured by protocol that the third party will serve properly and has no relatable (and thus exploitable) data. An approach which enables these demands is presented in this paper. The zombie is powerless in terms of exploits and routing which is not (and cannot be) managed by the zombie since he does not know to whom an arbitrary entry in the ledger belongs. Instead, the routing is accomplished by the anonymous exchange mechanism which guarantees a client to trust any central host (zombie), even corrupted ones as the provided packages cannot be used against him. Finally the central node acts as a trustworthy API, one that receives and aggregates entries in chronological order to form the ledger. Simply said, the ledger itself would serve as a third-party and buffer (temporary storage) with unprovable content. Clients would commit messages as entries and simultaneously request every entry commited by any other client - this is equivalent to a ledger distribution, except that here is no feedback, neither node-to-node nor node-to-server. Received entries from the ledger are generally not intended for decryption except those which can be decrypted locally by the receiving client. This central design at hand would decrease latencies and respect absolute anonymity, not by infeasability but through maximized relational entropy. Induced entropy in the form of categorization forces a potential attacker to assume a flat prior distribution when trying to predictively link two nodes which is inspired by Shannon's theorem of perfect secrecy.
In a star topology the central node can quickly become a target for internal but also external attacks. An attacker who controls the zombie will face the same issues during sniffing, however he is able to delete entries or to denial the service from outside but he could (only) surpress the information channel. 
For a secure messaging system whose protocol obeys the stated properties, a star topology becomes naturally attractive over a decentralized one.


# Routing and Entropy
Defining a route within the context at hand requires a single message transfer - the elementary block of the workflow. Routes which flow via a third party are vulnerable as they can be exposed and so might the origin and target address, apparently. This introduces a logical connection - a "relation" which is a link between nodes. In general, all messages sent via regular TLS/Socket messengers expose the routes of their clients, at least towards the third party. The same messengers require the exposure of the sender and receiver address towards the central party as the routing (in this case the transfer to receiver's inbox) is accomplished by the service running on third-party machine.  

Although the ledger is served by a central instance it is still distributed across the network to create as many mimicked relations as possible. In this scenario the decentralization is used to guarantee relational entropy rather than to disable manipulations of the ledger since these cannot harm the privacy between clients, nor expose their existance or prove the existence of exchange or identities - this assures plausible deniability for all clients. Further, it is not possible to classify entries to e.g. extract any data or meta data that could relate to any exchange or it's clients.

# Footprint Spoofing
The network can use entropy to hide the relations between nodes (route leaks). But this will not protect a sender, who apriori needs to connect to the ledger which inevitably leaves a trace (e.g. IP, DNS footprint, logged header information) and exposes him/her ID towards the central party. The party has access to the footprint and may potentially extract some information or point from an extracted package to a ledger entry - if still tracked by the ledger. The total route will not be exposed i.e. no relation exposure or privacy vulnerabilities, but still yields information about the activity of a client. To obfuscate the sender's footprint a DNS proxy or onion route should provide a proper service.


# Protocol
For a secure messaging system whose protocol obeys the stated properties, a star topology becomes naturally attractive over a decentralized one.
These conditions can be met by a service if it obeys the following protocol.

<br>



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