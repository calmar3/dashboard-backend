var express = require('express');


module.exports = function (app) {

    var lampCtrl = require('../controller/lampCtrl');

    app.get('/api/lamps',lampCtrl.getAllLamps);

    app.get('/api/data',lampCtrl.getData);

    app.post('/api/data',lampCtrl.storeData);

    app.delete('/api/lamp/:id',lampCtrl.deleteLamp);

    app.post('/api/lamp',lampCtrl.insertLamp);
};
