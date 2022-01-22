# Public Messaging Protocol

## Protocol
As the server and its clients form a star topology, the central node can quickly become a target for various kinds of attacks. Sniffing and mining data becomes more attractive nowadays, especially for companies. For instance hosts of messaging services collect plenty of information throughout end-to-end encrypted conversations. Meta data help an attacker to traceback the times when messages are sent, received, how often messages are being read but most importantly who talks to whom. This chunk of information is enough to reconstruct the whole network with all it's bond activities which represent conversations between the nodes, representing the clients, and can extract a relational model to devide clients into social bins. A classic peer-2-peer protocol enables clients to connect mutually without a third party - this has proven to be a successful model for trusted non-centralized finance. Such distributed networks protect from manipulation but actually do not protect from tracking and routing except for protocols which utilize ring signatures for instance. Chain analysis tools allow to map a pseudo anonymous address and can access the whole history since creation, as anyone else. Since the concept of secure messaging require a buffer for messages while a client is disconnected, a third party seems inevitable. This concept however can be constructed in a distributed manner: namely where the chain itself would serve as a buffer and clients are filing messages on to the ledger and read from the ledger. But this comes with a cost: Every node in the network would have to save and serve the ledger which is nothing but junk data as nothing has to be proven, furthermore the end-to-end latency would be massively higher compared to a centralized system. 

For a secure messaging system whose protocol prohibits hosts from saving meta data, a star topology becomes more attractive than the distributed one, but recall that in a centralized system manipulations become easy while tracking hard - if the following protocol is obeyed


### I. Trusted Identification
Every client is identified by a unique RSA key pair where the public key serves as the client's address (the holder of the address) and is used for asymmetric encryption processes.  No one in nor outside the network knows that an address exists, except apparently the holder and his/her contacts. Clients with access to an address, other than their own, share the ability to contact the holder and subsequently vice versa.

### II. Anonimity through Publicity
The ledger in this protocol is public, but also centralized, anonymous and time-limited which violates the general definition of a ledger. It is not possible to record, reconstruct or track mututal connections, identities or their history of activities. 

### II. Ledger Entry Security
A ledger entry is always encrypted (including the senders identity) and has a lifetime. When an entry expires it is removed from the ledger. To releave the system from high traffic the lifetime can be adjusted such that high traffic and frequent activity may influence it indirectly.



### IV. Routing Entropy

Message routes can only be reconstructed and linked to clients if there is a small amount of active clients in the network. Every active participant or client needs to download each ledger entry in its encrypted form and try to decrypt on the client side. This increases the relational entropy and prevents routing. A message is never send to a specific receiver.