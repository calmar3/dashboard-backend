var express = require('express');


module.exports = function (app) {

    var lampCtrl = require('../controller/lampCtrl');

    app.get('/api/lamps',lampCtrl.getAllLamps);

    app.delete('/api/lamp/:id',lampCtrl.deleteLamp);

    app.post('/api/lamp',lampCtrl.insertLamp);
};
