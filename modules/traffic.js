/* Grouping mechanism methods */

const userTrafficLimit = 1; // traffic lower bound in [MB/s]
const bins = [1, 4, 16, 26, 64, 128, 256, 512, 1024];

async function estimateStream (ledger) {

    /* Estimate the data stream in Bytes/s from given ledger object */

    // estimate ledger load in Bytes
    const load = new TextEncoder().encode(JSON.stringify(ledger)).length;

    // estimate the time in seconds
    const ledgerEntries = Object.values(ledger);
    const time = (ledgerEntries[-1].timestamp - ledgerEntries[0].timestamp) * .001;

    // estimate traffic in MB/s
    const traffic = load/time/(1024**2);

    return traffic

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
