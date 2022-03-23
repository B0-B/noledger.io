# Peer-to-Peer
The main criterion for a physical peer-to-peer network demands data or value to flow directly between arbitrary node pairs without the need of any third service. However, in central ledger protocols, which are fully controlled by the central party, there is no direct transfer between nodes. Instead the central instance takes transaction orders, validates them to subsequently adjust the receiver and sender balances within the ledger. The balances which may be accounted publicly emit the illusion of end-to-end flows of information or value. 

The illusion of a concept which does not involve middle men persists throughout different topologies (also decentralized ones). 
This may be illustrated by the hard concept of a pure peer-to-peer value/information exchange system in which two individuals (members of a P2P network) would really have to meet physically for an exchange instead of filing commissions to a third party. But even in this case, if for instance one of the indivudals would require a vehicle to attend the meeting, the whole transaction would depend on this third service - the vehicle. Obviously the vehicle yields no security vulnerabilities for the transaction itself, i.e. the value will not be lost but still plays a crucial role for the exchange to proceed. A peer-to-peer implementation cannot exclude dependencies and other instances in general, however a protocl can be constructed in a decentralized way to overcome these issues.
The most popular approach to avoid ledger manipulations utilizes decentralization. The electronic cash system proposal by Satoshi Nakamoto is also misinterpreted in regards of "peer-to-peer" since tokens are not exchanged directly between nodes, nor do they exist. Instead, oders are broadcasted to validators and miners, distributed third parties which hold a copy of the ledger to secure the network and to guarantee democratic decentralization with proof, respectively. Once the network agrees to the longest chain which resembles the proven ledger history the balance accounting will apply in equivalent fashion as described in a centralized system - with virtual but not inflatable money. Hence, a distributed ledger creates a peer-to-peer effect, but with the difference to a central sys. that the consesus does not rely on trust towards a single party but on validation and proof which can be gathered liberally across the network. The stability of singular dependencies become irrelevant. In simple words: No individual can manipulate in any sense whatsoever which complies with the rights and force assignment for the middle man which makes the cash system so nubile.


# The Problem of Anonimity
To reach consensus a ledger would require a non-injective and non-surjective mapping between each entry and its stakeholders e.g. for signature puposes. The identity proof that is associated with the byzantine fault is typically solved with an asymmetric crypto system that in fact yields a problem by design: pseudo-anonymous addresses are publicly exposed for the sake of the mechanism which does not preserve anonymity. Even without a map between user identities and addresses the transactions can be classified and reconstructed to a relational net, this promotes attackers to trace exchange routes to point to specific clients. Although successful solutions were presented e.g. ring signatures and mixing, they are based on questionable obfuscation, computational infeasability and can lead to potential privacy leaks. Distributed networks protect from manipulation but actually not conveniently (by design) from tracking and routing. Anonymous routes among clients are crucial for absolute privacy and are not (and should not be) provable by others and hence do not demand consensus at all. One denotes that a system which does not require work or proof to confirm commits invites for spam and denial as in a centralized system manipulations become easier to achieve, whereas the message encryption, and anonimity (which is shown in the following) is not enhanced through further decentralization.


# A Central Ledger
Besides the security aspects modern messaging concepts demand features, a crucial one is a buffer to store messages (MITM) while the receiver is disconnected. So far, third parties seemed inevitable for this job but also mark potential risks and red flags as they might (and should) be expected to exploit the network. For instance sniffing and data mining have become generic and standard among hosts which may collect plenty of information throughout end-to-end encrypted conversations through meta data. There have been rivers of incidents over the past decades that probably reveal only the tip of the ice berg in which faulty middle-men have not served their network but expoited it directly or indirectly.

The general idea of provable anonimity that could be assured by a simple mechanism led to a simple investigation which yields a direct observation: a central middle man can be forced into a state in which it is always assured by protocol that the any inbetween party will serve properly and has no relatable (and thus exploitable) data to work with. An approach which enables these demands is presented in this paper. The central node is powerless in terms of exploits and routing which is not (and cannot be) managed by itself since it is unknown to whom an arbitrary entry in the ledger belongs. Instead, the routing is accomplished by the anonymous exchange mechanism which guarantees a client to trust any central host, even corrupted ones as client packages cannot be used against him. 

Finally the central node acts as a trustworthy API, one that receives and aggregates anonymous entries in chronological order to form the ledger i.e. the ledger itself would serve as a third-party and buffer (temporary storage) with unprovable content. Clients would commit messages as entries and simultaneously request every entry commited by any other client - this is equivalent to a ledger distribution, except that here is no feedback, neither client-to-node nor client-to-client. Received entries from the ledger are generally not intended for decryption except those which can be decrypted locally by the receiving client which tilts towards the concept of a instant scratchcard lottery. This central design at hand would decrease latencies and respect absolute anonymity, not by infeasability but through maximized relational entropy. Induced entropy in the form of categorization forces a potential attacker to assume a flat prior distribution when trying to predictively link two nodes, this concept was inspired by Shannon's theorem of perfect secrecy.
In a star topology the central node can quickly become a target for internal but also external attacks. An attacker who controls the zombie will face the same issues during sniffing, however he is able to delete entries or to denial the service from outside, how he could (only) surpress the information channel. 
For a secure messaging system whose protocol obeys the stated properties, a star topology becomes naturally attractive over a decentralized one.


# Routing and Entropy
Defining a route within the context at hand requires a single message transfer - the elementary block of the workflow. Routes which flow via any party are vulnerable as they can be exposed and so might the origin and target address, apparently. This introduces a logical connection - a "relation" which can be interpreted as an abstract link between nodes. In general, all messages sent via regular TLS/Socket messengers expose the routes of their clients, at least towards the third party. The same messengers require the exposure of the sender and receiver address towards the central party as the routing (in this case the transfer to receiver's inbox) is accomplished by the service running on another machine.  

Although the ledger is served by a central instance it is still distributed across the network to create as many mimicked relations as possible. In this scenario the decentralization is used to guarantee relational entropy rather than to disable manipulations of the ledger since these cannot harm the privacy between clients, nor expose their existance or prove the existence of exchange or identities - this assures plausible deniability for all clients. Further, it is not possible to classify entries to e.g. extract any data or meta data that could relate to any exchange or it's clients.

# Footprint Spoofing
The network can use entropy to hide the relations between nodes (routes). But this will not protect a sender, who apriori needs to connect to the ledger from leaving a trace (e.g. IP, DNS footprint, logged header information) that potentially exposes him/her identity towards the central party. The party has access to the footprint and may potentially extract some information or point from an extracted package to a ledger entry - if still tracked by the ledger. Although the total route will not be exposed by this i.e. no relation exposure or privacy vulnerabilities, the activity of a client can become a vulnerability. To obfuscate the sender's footprint a preceded DNS proxy or onion route should provide a proper security to solve the issue. The attacker would just map traces to random exit nodes.


# Base Protocol Proposal
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
|   | check | String | Client specific check string encrypted with receivers address  |
|   | from | String | The senders public address sym. encrypted with AES key |
|   | cipher | String | The senders message encrypted with AES key |
|   | phrase | String | Secret phrase for AES key generation encrypted with receivers address |
|   | time | Integer | Ledger entrance timestamp in plain text |   

### IV.2) Authenticity 
The authenticity is barely guaranteed by the successful delivery only. Although addresses are anonymous they can potentially be phished and used for the encryption of fake packages (spoofing). If these messages would yield an unknown sender address to the reciever (victim) they might be filtered. Otherwise, if an attacker would mimick a phished address which is known by the victim he would not be able to receive any messages from the victim since he is not the owner of the private key that corresponds to the spoofed address. 

Spoofed attacks and spam can be avoided by a check string upon which clients can mutually aggree to in secret.  By default messages whose header is not decryptable or whose decrypted header shows a different yield than the agreed check are directly discarded.

### IV.3) Integrity
Due to the anonymous and asymmetric end-to-end encryption every manipulation or variation of the entry payload during transit would "almost surely" impact it's decryptability and thus reveal any difference. Corrupted package receivers would not have to engage according to the failed decryption followed by procedure IV.2. Integrity is ensured thereby.

## V) Clients

### V.1) Initialization
The identification described in I) is performed locally. Clients identify anonymously without any exchange with the server.

### V.2) Routing Entropy
Every active participant (client) needs to request each ledger entry in its encrypted form and try to decrypt exclusively on the client side. This maximizes the relational entropy between clients and prevents any feedback about the decryption success.

### V.3) Ledger Reading
Entries are requested by the client by sending the last observed ledger id to the central node. The returned package will contain all entries between the last id observed by the client and the last id received by the ledger. The last observed id is updated by the highest id in the returned set.

### V.4) Entry Decryption
Every entry contained in the node response is tried to be decrypted with the requester's private key. The success is determined from decrypting the header and comparing to the check string to upon which all clients or a subset of them have agreed to. Additionally, a second check string (2nd factor) can be used mutually between clients. If one of the factors fail the entry is discarded whereas on success the rest of the entry is decrypted in the order 
1. Decrypt the provided AES phrase using the private key
2. Generate the AES key
3. Use the decrypted AES key to further decrypt the sender's address
4. Use the AES key to decrypt the cypher with the message yield
Step 2 fulfills the key exchange outlined in II.2. 