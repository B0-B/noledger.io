# Protocol Proposals and Development
# 1.1.1
<h2><strong>Grouping</strong> [pending]</h2>

[Bitmessage](https://wiki.bitmessage.org/) (est. 2012) has already shown that grouping the clients into "streams" would releaf the clients from high network traffic. DDoS quickly appears to be the downside of the protocol, but can be enhanced through further decentralization of service (split the traffic) or computational infeasability - or in this case by grouping.

To avoid unnecessary load balances of groups users cannot chose the group by themselves. It could lead to non-uniform accumulations of clients. Instead the group id will be automatically drawn from the generated address or public key to ensure the uniformity drawn from the unpredictability of the hash function.
The number of groups can be varied by choice of bins allowed by the mechanism:
1. Find the first digit in the address -> 10 bins
2. Find the first letter in the address -> 26 bins
3. Upper and lower case -> 52 bins

and so on. The actual number of choices for a mechanism is countable but enormous. All users would have to obey the consensus, since the construction of the group id while sending messages is crucial to reach the receiver.

So if a message is locally packaged for the submit it will be tagged with the group label that is associated to the receiver address. For instance an address which starts with "5Oq_eBqku.." will be automatically assiged to group 5 if we follow the mechanism in 1. This way of choice makes sure that all clients will be distributed uniformly (by the weak law of large numbers) across all groups. The traffic needed to be decrypted by each client shrinks by a factor of `1/g` where `g` is the number of "bins" or groups. 

An appropriate choice of bins would depend on the current traffic. If there is a traffic load limit `l = const.` in units of bytes/s for each user and `L` the current streamed traffic i.e. data rate streamed to the ledger then `g ≥ L/l` where `L/l` represents the lower bound. On average every user of any of the `g` groups would receive a traffic smaller or equal to `l`. The total data size received by the same users is obtained by multiplying `l` with the time frame considered (usually 1 second).

The derivation of the total traffic obeys the same scaling as [Metcalfe's law](https://en.wikipedia.org/wiki/Metcalfe%27s_law) as the more users enter the network the more contacts one client will exchange messages with (prop.) which will scale his overall usage proportionally to `n²` ([triangular number](https://en.wikipedia.org/wiki/Triangular_number) whose linear term vanishes in large limit), `n` is the number of active clients. This can also be understood as the number of possible pings between n nodes in an enclosed network.
Alternatively, this law can be derived from a more specific perspective. n active users may have on average `z` contacts they communicate to. For each contact they on average may exchange `m` messages each of mean size `s` (in Bytes). Then the total size send to the ledger is the product `L = z•m•s•n` and the mean stream/user can be condensed to `<L/n> = z•m•s` since z, m and s are all meaned, and can be considered for further analysis of the user specific usage in general. So we obtain `L = <L/n>•n`. The network's total relay traffic `T` can be determined by considering that every client needs to download the whole ledger load `L`. This finally leads to `T = L•n = <L/m>•n² ∝ n²` which proves the scaling statement above.

An example: 1 Mio. active clients would already build up `T = 1TiB/t` of traffic by each sending a single byte in a considered time frame `t` ⇔ `<L/m> = 1 byte/t`. This means that the ledger traffic would have accounted for `L = T/n = l (if g = 1) = 1MiB` which a single client on avg. would have to download. The load `T` which is a million times greater will have to be managed by the service who has to serve all kinds of requests that involve uploads and downloads. Sticking with the example a kilo Byte would scale `l` to 1GiB.

The host sees what every client can see namely the ledger with encrypted entries and it's size `L` but not the number of users `n`. At least determining `n` is not straight forward and if would be biased since a user could potentially vary his IP. However if one could approximately fit the parameters `z, m, s` it would be possible to estimate `n` via `n = L/(z•m•s)` but these parameters will also change if `n` changes since their persistency was taken for granted for sake of the argument. Luckily the boundary of `g` can be determined  by a single measurement of `L` at a time. While `l` is constant `L` can be updated and so will the needed group bins.

Finally we get

| group bin condition |
|---|
| `g ≥ L/l` |

### Server-side Process
1. The node estimates `L`
2. When `L` is determined, the node computes the lower bound `L/l`
3. determine the needed base `g = L/l`
4. If the current grouping mechanism supports this base go to 1. Otherwise continue with 4.
5. Choose a grouping mechanism 1., 2., 3., 4., ... which supports the needed base `g`. For g = 11 one might choose a HEX system for grouping since 16 > 11 thus fulfills the group bin condition.

### Client-side Process
1. If a client connects to read or write he will get the current mechanism from the server
2. To send a messages clients needs to determine the group ID given the receivers address and the current mechanism received in 5. The first HEX compliant number of the receiver address will then fix his group ID.
3. The package send to the server needs to contain the ID in plain text.
4. All active clients need to append, next to the ledger id, their own group ID (determined analogous to 6. with own address) to the ledger reading request. The node will then gather only entries for the response which show the same group ID


<br>


# 1.1.0
<h2><strong>Client-Specific Check String</strong> [stable]</h2>
First attempts to create authenticity involved elliptic curve signatures which would enable every client to sign each message. The receiver at the other end, who posseses the senders public key is able to determine if the sender is in posession of the private key.

The upper method is very often used in most of the web-encrypted communication however it poses a threat but also does not solve the problem of real authenticity since:
- It is not advised in computer cryptography to use the same key pair for signing as for encryption. Instead a seperate key pair shall be generated - another keypair which has to be linked to the main one to ensure the signature is associated to an address. But this raises the question how to keep the track of mapping. Especially if keys (for security reasons) need to be exchanged.
- A signature does not verify that a message was truly sent by the user. Instead it just verifies that the user is in posession of the private signing key (which can be the decryption key or not). Apparently, hackers who can obtain access to that key i.e. steal it can sign (and if signing key and decryption key are the same read) every message and thus pretend to be someone else.
- Stolen signature keys allow to sign any message that was intended for any contact i.e. a single key to sign them all.

A much simpler and original solution that was thrown into the discussion involved the sharing of relation-specific information, only known to two users - a secret - which cannot be fetched or copied so easily. Also no changes need to be tracked, mapped etc. and simplifies changes of the secret on behalf. This may be double-confirmed among the clients e.g. via the DHM channel outlined in the base protocol. The number of secrets needed to be memorized will apparently outweigh the single key signature method but this pragmatic method raises the likelihood that messages which contain the secret originate truly from the desired sender but also in case of theft do not allow an attacker to use it in order to spoof arbitrary contacts but only the one which corresponds to the stolen secret.

The header check string is used to test the decryptability of a package, but the same mechanism can be used as a second factor for authenticity checks or to block spam. For this two participants that share a secret (word, number, etc.) can send it encrypted with the entry to the ledger. Messages (entries) which are downloaded from the ledger might be decryptable and show the correct receiver address, but in order to authenticate must also yield the client specific check string, otherwise the entry will be discarded. Spam attacks could be filtered, but also this second check string can be invoked to block a conversation i.e. changing the client-specific check string without letting anyone know. The spec. check string is by default initialized in the same way as the default header check string. Two client can be reached by another client if his address is known and their client-specific check strings match.
<br><br>

# 1.0.0
<h2><strong>Random Padding</strong> [stable]</h2>
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

<h2><strong>Base Protocol</strong> [stable]</h2>

A secure and anonymous ledger-based messaging protocol. 

See the [full paper](https://github.com/B0-B/noledger/blob/main/docs/core/paper.md).