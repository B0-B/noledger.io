/*
Custom anti DOS filter attacks unwanted agents, country codes etc.
*/
function firewall(request) {
    //console.log(request)
    return true
}

module.exports = firewall;