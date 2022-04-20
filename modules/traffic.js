/* Grouping mechanism methods */

const userTrafficLimit = 1; // traffic lower bound in [MB/s]
const bins = [1, 4, 16, 26, 64, 128, 256, 512, 1024];

async function estimateSize (ledger) {
    /* Estimates the size in bytes */
    return JSON.stringify(ledger).length;
}

async function updateStream (newValue, old, window=20) {

    /* Takes packaged entry and old stream value to return the new updated stream */

    // return updated value using exponential smoothing with delay window converted to alpha
    const alpha = 2/(window+1);
    return alpha*newValue+(1-alpha)*old;
    
}

async function estimateBinLowerBound (stream, limit) {

    /* Estimate the lower bound for needed bins = number of groups*/

    return stream/limit 

}

async function base (binLowerBound) {

    /* This function chooses an appropriate base >= given bins */

    for (let i = 0; i < bins.length; i++) {
        if (bins[i] > binLowerBound) {
            return bins[i]
        }
    }

    throw Error("The provided stream traffic is to high to choose an appropriate base and respect the user traffic limit.")
}

module.exports = {
    estimateSize, updateStream, estimateBinLowerBound, base
};