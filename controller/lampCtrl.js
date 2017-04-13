var cloudantCtrl = require('../controller/cloudantCtrl');

var lightSystemDb = null;

exports.getAllLamps = getAllLampsFn;

exports.createLamps = createLampsFn;

/**
 *
 * /api/lamps to get all lamps in system
 *
 */
function getAllLampsFn(request,response) {

    if (!lightSystemDb)
        lightSystemDb = cloudantCtrl.getLightSystemDb();
    lightSystemDb.get("lamps",function (err,res) {
        if (err){
            response.status(404).send({status:"E",message:"Cannot retrieve lamps"});
            return;
        }
        else{
            response.status(200).send({status:"S",lamps:res.lamps});
            return;
        }

    });
}

/**
 * used to create lamps when needed
 */
function createLampsFn() {
    var allLamps = {
        "_id":"lamps",
        "lamps":[]
    };

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var dates = ["25-12-2017","25-12-2016","25-12-2015","25-12-2014"];

    var streets = [ "Via dei Fori Imperiali" , "Via di San Giovanni in Laterano"];
    for (var i = 0 ; i<100; i++){
        var lamp = {};
        lamp.id = i+1;
        lamp.model="";
        lamp.model += possible.charAt(Math.floor(Math.random() * possible.length));
        lamp.model += possible.charAt(Math.floor(Math.random() * possible.length));
        lamp.address = streets[i%2];
        if (i%2 === 1){
            lamp.latitude = "41.88893909999999";
            lamp.longitude = "12.498108600000023";
        }else{
            lamp.latitude = "41.8933241";
            lamp.longitude = "12.486988999999994";
        }
        lamp.substitution_date = dates[i%4];
        allLamps.lamps.push(lamp);
    }

    if (!lightSystemDb)
        lightSystemDb = cloudantCtrl.getLightSystemDb();
    lightSystemDb.insert(allLamps,function (err,res) {
       if (err){
           console.log(err);
       }
       else{
           console.log("Lamps Inserted");
       }
        
    });
}