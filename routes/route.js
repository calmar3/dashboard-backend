var express = require('express');


module.exports = function (app) {

    var lampCtrl = require('../controller/lampCtrl');

    /**
     * get lamps object with all lamps
     */
    app.get('/api/lamps',lampCtrl.getAllLamps);

    /**
     * get data to show in dashboard
     */
    app.get('/api/data',lampCtrl.getData);

    /**
     * store data showed in dashboard
     */
    app.post('/api/data',lampCtrl.storeData);

    /**
     * delete lamp with id
     */
    app.delete('/api/lamp/:id',lampCtrl.deleteLamp);

    /**
     * insert new lamp
     */
    app.post('/api/lamp',lampCtrl.insertLamp);
};
