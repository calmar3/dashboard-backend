
exports.initDBConnection = initDBConnectionFn;

exports.getLightSystemDb = getLightSystemDbFn;

var config = require('../controller/utils/config');
var Cloudant = require('cloudant');
var cloudant = null;


var lightSystemDb = null;

/**
 * Get Cloudant credentials from vcapServices
 */
function initDBConnectionFn() {
    var dbCredentials = {
        dbname: "lightsystem"

    };
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        for (var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                dbCredentials.host = vcapServices[vcapService][0].credentials.host;
                dbCredentials.port = vcapServices[vcapService][0].credentials.port;
                dbCredentials.user = vcapServices[vcapService][0].credentials.username;
                dbCredentials.password = vcapServices[vcapService][0].credentials.password;
                dbCredentials.url = vcapServices[vcapService][0].credentials.url;
                cloudant = Cloudant({ url: dbCredentials.url, plugin: 'retry' });
                setLightSystemDb(dbCredentials);
            }

        }
    } else {
        dbCredentials.host = config.host;
        dbCredentials.port = config.port;
        dbCredentials.user = config.username;
        dbCredentials.password = config.password;
        dbCredentials.url = config.url;
        cloudant = Cloudant({ url: dbCredentials.url, plugin: 'retry' });
        setLightSystemDb(dbCredentials);

    }
}

function setLightSystemDb(dbCredentials) {
    // check if DB exists if not create
    lightSystemDb = cloudant.use(dbCredentials.dbname);
}

function getLightSystemDbFn() {
    if (lightSystemDb === null)
        initDBConnectionFn();
    return lightSystemDb;

}