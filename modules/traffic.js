/* Grouping mechanism methods */

const userTrafficLimit = 1; // traffic lower bound in [MB/s]
const bins = [1, 4, 16, 26, 64, 128, 256, 512, 1024];

async function estimateSize (ledger) {
    /* Estimates the size in bytes */
    const size = new TextEncoder().encode(JSON.stringify(ledger)).length;
    return size;
}
async function estimateStream (ledger, meanWindow=20) {

    /* Estimate the data stream in Bytes/s from given ledger object */

    // estimate ledger load in Bytes
    const load = await estimateSize (ledger);

    // estimate the time in seconds
    const ledgerEntries = Object.values(ledger);
    const time = (ledgerEntries[-1].timestamp - ledgerEntries[0].timestamp) * .001;

    // estimate traffic in MB/s
    const traffic = load/time/(1024**2);

    return traffic

}

async function updateStream (newValue, old, window=20) {

    /* Takes packaged entry and old stream value to return the new updated stream */

    // return updated value using exponential smoothing with delay window converted to alpha
    const alpha = 2/(window+1);
    return alpha*newValue+(1-alpha)*old;
    
}
async function estimateBinLowerBound (stream) {

    /* Estimate the lower bound for needed bins = number of groups*/

    return Math.floor( stream/userTrafficLimit ) + 1

}
async function base (binLowerBound) {

    /* This function chooses an appropriate base >= given bins */

    for (let i = 1; i < bins.length; i++) {
        if (bins[i] > binLowerBound && 
            bins[i-1] <= binLowerBound) {
            return bins[i]
        }
    }

    throw Error("The provided stream traffic is to high to choose an appropriate base and respect the user traffic limit.")
}

module.exports = {
    estimateSize, estimateStream, estimateBinLowerBound, base
};