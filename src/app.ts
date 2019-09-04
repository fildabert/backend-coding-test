'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
    app.get('/health', (req, res) => res.status(200).send('Healthy'));

    db.getAsync = function (query: string) {
        return new Promise((resolve, reject) => {
            db.all(query, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }
    db.postAsync = function (query: string, value: Array<string>) {
        return new Promise((resolve, reject) => {
            db.run(query, value, function (err) {
                if (err) {
                    reject(err);
                } else {
                    db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                }
            })
        })
    }
    app.post('/rides', jsonParser, async (req, res) => {
        const startLatitude: number = Number(req.body.start_lat);
        const startLongitude: number = Number(req.body.start_long);
        const endLatitude: number = Number(req.body.end_lat);
        const endLongitude: number = Number(req.body.end_long);
        const riderName: string = req.body.rider_name;
        const driverName: string = req.body.driver_name;
        const driverVehicle: string = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.status(400).send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.status(400).send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            console.log(riderName, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            return res.status(400).send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.status(400).send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.status(400).send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        var query = 'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)'
        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

        const rows = await db.postAsync(query, values)
        try {
            res.status(201).send(rows);
        } catch (err) {
            return res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }
    }); 

    app.get('/rides', async (req, res) => {

        const rows = await db.getAsync('SELECT * FROM Rides');
        try {
            if (rows.length === 0) {
                return res.status(500).send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
            const totalPages: number = Math.ceil(rows.length / 5);
            var page: number = Number(req.query.page);
            if (!page) {
                page = 1;
            }
            if (page > totalPages) {
                page = totalPages
            }
            res.status(200).send({
                page,
                totalPages,
                rides: rows.slice(page * 5 - 5, page * 5)
            });
        } catch (error) {
            return res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }
    });


    app.get('/rides/:id', async (req, res) => {
        const rows = await db.getAsync(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`)
        try {
            if (rows.length === 0) {
                return res.status(200).send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.status(200).send(rows);
        } catch (err) {
            return res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

    });


    return app;
};
