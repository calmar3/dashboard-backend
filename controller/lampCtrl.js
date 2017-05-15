var cloudantCtrl = require('../controller/cloudantCtrl');

var host = require('../controller/utils/host');

var requestModule = require('request');

var lightSystemDb = null;

exports.getAllLamps = getAllLampsFn;

exports.createLamps = createLampsFn;

exports.insertLamp = insertLampFn;

exports.deleteLamp = deleteLampFn;

exports.getData = getDataFn;

exports.storeData = storeDataFn;


var localControllerHost = host.localController;


/**
 * Get data object from database, with all data to show in dashboard
 * Send 404 if cloudant response with error, 200 otherwise
 * @param request - HTTP request
 * @param response - HTTP response
 */
function getDataFn(request,response) {
    if (!lightSystemDb)
        lightSystemDb = cloudantCtrl.getLightSystemDb();
    lightSystemDb.get("data",function (err,res) {
        if (err){
            response.status(404).send({status:"E",message:"Cannot retrieve data"});
            return;
        }
        else{
            response.status(200).send({status:"S",control:res.control,streets:res.streets,lamps:res.lamps,warnings:res.warnings,
            rank:res.rank,city:res.city});
            return;
        }

    });
}

/**
 * Update data object ind database, with all data to show in dashboard
 * Send 500 if cloudant response with error, 200 otherwise
 * @param request - HTTP request
 * @param response - HTTP response
 */
function storeDataFn(request,response) {
    if (!lightSystemDb)
        lightSystemDb = cloudantCtrl.getLightSystemDb();
    lightSystemDb.get("data",function (err,res) {
        if (err){
            response.status(404).send({status:"E",message:"Cannot retrieve lamps"});
            return;
        }
        else{
            if (request.body.control && request.body.control.length > 0 )
                res.control = request.body.control;
            if (request.body.streets && request.body.streets.length > 0 )
                res.streets = request.body.streets;
            if (request.body.lamps && request.body.lamps.length > 0 )
                res.lamps = request.body.lamps;
            if (request.body.warnings && request.body.warnings.length > 0 )
                res.warnings = request.body.warnings;
            if (request.body.city && request.body.city.length > 0 )
                res.city = request.body.city;
            if (request.body.rank && request.body.rank.length > 0 )
                res.rank = request.body.rank;
            lightSystemDb.insert(res,function (err,res) {
                if (err){
                    console.log("cloudant err");
                    response.status(500).send({status:"E",message:"Error updating data"});
                    return;
                }
                else{

                    response.status(200).send({status:"S",message:"data updated"});
                    return;
                }
            });

        }

    });
}
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
 * Call Local-Controller to insert Lamp.
 * If it response with no error, insert lamp from lamps in Cloudant
 * @param request - HTTP request
 * @param response - HTTP response
 */
function insertLampFn(request,response) {


    var options = { method: 'POST',
        url: localControllerHost + '/lamp',
        headers: {
            'content-type': 'application/json'
        },
        body: request.body,
        json: true
    };

    requestModule(options, function (error, res, body) {
        if (error || res.statusCode >= 400){
            console.log("sensor err");
            response.status(500).send({status:"E",message:"Internal Server Error"});
            return;
        }else{
            if (!lightSystemDb)
                lightSystemDb = cloudantCtrl.getLightSystemDb();
            lightSystemDb.get("lamps",function (err,res) {
                if (err){
                    console.log("cloudant err");
                    response.status(404).send({status:"E",message:"Cannot retrieve lamps"});
                    return;
                }
                else{
                    res.lamps.push(request.body);
                    lightSystemDb.insert(res,function (err,res) {
                        if (err){
                            console.log("cloudant err");
                            response.status(500).send({status:"E",message:"Internal Server Error"});
                            return;
                        }
                        else{
                            response.status(200).send({status:"S",message:"Inserted Lamp"});
                            return;
                        }
                    });
                }

            });
        }
    });

}

/**
 * Call Local-Controller to delete Lamp.
 * If it response with no error, delete lamp from lamps in Cloudant
 * @param request - HTTP request
 * @param response - HTTP response
 */
function deleteLampFn(request,response) {

    console.log(request.params.id);
    var options = { method: 'DELETE',
        url: localControllerHost + '/lamp/'+request.params.id,
        headers: {
            'content-type': 'application/json'
        },
        body: request.body,
        json: true
    };
    requestModule(options, function (error, res, body) {
       if (error || res.statusCode >= 400){
           console.log("sensor err");
            response.status(500).send({status:"E",message:"Internal Server Error"});
            return;
        }else{
            if (!lightSystemDb)
                lightSystemDb = cloudantCtrl.getLightSystemDb();
            lightSystemDb.get("lamps",function (err,res) {
                if (err){
                    console.log("cloudant err");
                    response.status(404).send({status:"E",message:"Cannot retrieve lamps"});
                    return;
                }
                else{
                    for (var i = 0 ; i < res.lamps.length ; i++){
                        if (parseInt(res.lamps[i].lampId) === parseInt(request.params.id)){
                            res.lamps.splice(i,1);
                            break;
                        }
                    }
                    lightSystemDb.insert(res,function (err,res) {
                        if (err){
                            console.log(err);
                            console.log("cloudant err");
                            response.status(500).send({status:"E",message:"Internal Server Error"});
                            return;
                        }
                        else{
                            response.status(200).send({status:"S",message:"Deleted Lamp"});
                            return;
                        }
                    });
                }

            });
        }
    });

}

/**
 * Function to create DATASET
 */
function createLampsFn() {
    var allLamps = {
        "_id":"lamps",
        "lamps":[]
    };


    var letters = "ABCDEF";
    var numbers = "0123456789";

    var dates = ["25/12/2016","20/12/2016","15/12/2016","15/12/2016","10/12/2016","05/12/2016","30/11/2016","25/11/2016","20/11/2016","15/11/2016","10/11/2016","05/11/2016"];

    var streets = {
        "Via dei Fori Imperiali": [[41.894023, 12.485734], [41.893841, 12.486051], [41.895370, 12.483641],
            [41.895166, 12.483839], [41.894799, 12.484301], [41.891447, 12.490452], [41.891696, 12.489950], [41.891921, 12.489605],
            [41.892377, 12.488787], [41.892513, 12.488496]],
        "Via di San Giovanni in Laterano": [[41.890045, 12.494499], [41.889850, 12.495199],
            [41.889649, 12.495803], [41.889429, 12.496543], [41.889194, 12.497305], [41.889054, 12.497726],
            [41.888870, 12.498354], [41.888569, 12.499291], [41.888024, 12.501084], [41.887537, 12.502607]],
        "Via Cavour": [[41.900465, 12.499454], [41.899978, 12.498950], [41.899291, 12.498220],
            [41.898693, 12.497555], [41.898142, 12.496922], [41.897367, 12.496053], [41.896449, 12.495077],
            [41.895913, 12.494476], [41.895227, 12.493779],[41.896878, 12.495508]],
        "Via Della Conciliazione": [[41.902134, 12.459918], [41.902150, 12.460465], [41.902166, 12.461253], [41.902214, 12.462305], [41.902246, 12.463447],
            [41.902498, 12.464091], [41.902502, 12.463195], [41.902494, 12.461645], [41.902482, 12.460695], [41.902462, 12.459818]],
        "Via del Corso": [],
        "Via Giulia": [],
        "Via Margutta": [],
        "Via Nazionale": [],
        "Via del Tritone": [],
        "Via del Babuino": [],
        "Via di Ripetta": [],
        "Via Sacra": [],
        "Via Appia Nuova": [],
        "Via Tiburtina": [],
        "Via Prenestina": [],
        "Via Nomentana": [],
        "Viale del Muro Torto": [],
        "Via dei Cerchi": [],
        "Corso Vittorio Emanuele II": [],
        "Via del Teatro di Marcello": [],
        "Via di San Gregorio": [],
        "Via del Colosseo": [],
        "Via Labicana": [],
        "Via Merulana": [],
        "Via Venti Settembre": [],
        "Via delle Terme di Caracalla": [],
        "Via Druso": [],
        "Via dell'Amba Aradam": [],
        "Viale Aventino": [],
        "Via Marmorata": [],
        "Viale Castrense": [],
        "Via Magnagrecia": [],
        "Viale Marco Polo": [],
        "Via Cilicia": [],
        "Via Cristoforo Colombo": [],
        "Via Ostiense": [],
        "Via Flaminia": [],
        "Via Salaria": [],
        "Corso di Francia": [],
        "Viale dei Parioli": [],
        "Viale Regina Margherita": [],
        "Corso Trieste": [],
        "Viale Regina Elena": [],
        "Via Taranto": [],
        "Via La Spezia": [],
        "Via Latina": [],
        "Via di Acqua Bullicante": [],
        "Via di Centocelle": [],
        "Via dei Monti Tiburtini": [],
        "Viale Tiziano": [],
        "Lungotevere Flaminio": [],
        "Lungotevere Aventino": [],
        "Viale Guglielmo Marconi": [],
        "Via Portuense": [],
        "Via di Portonaccio": [],
        "Via Pinciana": [],
        "Via delle Belle Arti": [],
        "Viale delle Milizie": [],
        "Viale Giulio Cesare": [],
        "Viale Angelico": [],
        "Via Gregorio VII": [],
        "Via delle Fornaci": [],
        "Via Aurelia Antica": [],
        "Viale di Trastevere": [],
        "Via del Porto Fluviale": [],
        "Circonvallazione Ostiense": [],
        "Via Casilina": [],
        "Via del Mandrione": [],
        "Via di Tor Pignattara": [],
        "Via di Porta Furba": [],
        "Viale Palmiro Togliatti": [],
        "Viale dei Romanisti": [],
        "Viale della Primavera": [],
        "Viale Tor de Schiavi": [],
        "Viale della Serenissima": [],
        "Viale Filippo Fiorentini": [],
        "Viale Catania": [],
        "Viale Castro Pretorio": [],
        "Viale del Policlinico": [],
        "Viale del Quirinale": [],
        "Viale Leone XII": [],
        "Via Vitellia": [],
        "Via Papiria": [],
        "Viale Cipro": [],
        "Circonvallazione Trionfale": [],
        "Via Baldo degli Ubaldi": [],
        "Via della Giuliana": [],
        "Viale Giuseppe Mazzini": [],
        "Lungotevere Prati": [],
        "Via Gallia": [],
        "Via dell'Arco di Travertino": [],
        "Circonvallazione Clodia": [],
        "Viale dello Stadio Olimpico": [],
        "Lungotevere dell'Acqua Acetosa": [],
        "Via della Sorbona": [],
        "Via Collatina": [],
        "Via Walter Tobagi": [],
        "Viale Antonio Ciamarra": [],
        "Viale delle Capannelle": [],
        "Viale Columbia": []
    };

    var id = 1;
    for (var key in streets){
        var loopLength = streets[key].length;
        if (loopLength === 0)
            loopLength = 10;
        for (var i = 0 ; i < loopLength ; i++){
            var lamp = {};
            lamp.lampId = id;
            lamp.model="";
            lamp.model += letters.charAt(Math.floor(Math.random() * letters.length));
            lamp.model += numbers.charAt(Math.floor(Math.random() * numbers.length));
            lamp.model += numbers.charAt(Math.floor(Math.random() * numbers.length));
            lamp.address = key;
            var str1 = dates[Math.floor(Math.random()*dates.length)];
            var dt1   = parseInt(str1.substring(0,2));
            var mon1  = parseInt(str1.substring(3,5));
            var yr1   = parseInt(str1.substring(6,10));
            var date1 = new Date(yr1, mon1-1, dt1);
            var d = date1.getTime();
            lamp.lastSubstitutionDate = d;
            if (streets[key].length === 0){
                lamp.latitude = "0";
                lamp.longitude = "0";
            }
            else{
                lamp.latitude = streets[key][i][0].toString();
                lamp.longitude = streets[key][i][1].toString();
            }
            lamp.consumption = 0;
            lamp.stateOn = true;
            lamp.lightIntensity = 0.0;
            lamp.timestamp = 0;
            lamp.city = "Rome";
            lamp.residualLifeTime = 0;

            allLamps.lamps.push(lamp);
            id++;
        }

    }

    /**
     * Insert object lamp in cloudantDb
     */


    //     if (!lightSystemDb)
    //     lightSystemDb = cloudantCtrl.getLightSystemDb();
    // lightSystemDb.insert(allLamps,function (err,res) {
    //    if (err){
    //        console.log(err);
    //    }
    //    else{
    //        console.log("Lamps Inserted");
    //    }
    //
    // });

    /**
     * write object lamps on file
     */

    // var fs = require('fs');
    // fs.writeFile("dataset.json", JSON.stringify(allLamps.lamps), function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //
    //     console.log("The file was saved!");
    // });
}