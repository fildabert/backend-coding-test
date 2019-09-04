'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
module.exports = function (db) {
    app.get('/health', function (req, res) { return res.status(200).send('Healthy'); });
    db.getAsync = function (query) {
        return new Promise(function (resolve, reject) {
            db.all(query, function (err, rows) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    };
    db.postAsync = function (query, value) {
        return new Promise(function (resolve, reject) {
            db.run(query, value, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    };
    app.post('/rides', jsonParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle, query, values, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startLatitude = Number(req.body.start_lat);
                    startLongitude = Number(req.body.start_long);
                    endLatitude = Number(req.body.end_lat);
                    endLongitude = Number(req.body.end_long);
                    riderName = req.body.rider_name;
                    driverName = req.body.driver_name;
                    driverVehicle = req.body.driver_vehicle;
                    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
                        return [2 /*return*/, res.status(400).send({
                                error_code: 'VALIDATION_ERROR',
                                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
                            })];
                    }
                    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
                        return [2 /*return*/, res.status(400).send({
                                error_code: 'VALIDATION_ERROR',
                                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
                            })];
                    }
                    if (typeof riderName !== 'string' || riderName.length < 1) {
                        console.log(riderName, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                        return [2 /*return*/, res.status(400).send({
                                error_code: 'VALIDATION_ERROR',
                                message: 'Rider name must be a non empty string'
                            })];
                    }
                    if (typeof driverName !== 'string' || driverName.length < 1) {
                        return [2 /*return*/, res.status(400).send({
                                error_code: 'VALIDATION_ERROR',
                                message: 'Rider name must be a non empty string'
                            })];
                    }
                    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
                        return [2 /*return*/, res.status(400).send({
                                error_code: 'VALIDATION_ERROR',
                                message: 'Rider name must be a non empty string'
                            })];
                    }
                    query = 'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
                    return [4 /*yield*/, db.postAsync(query, values)];
                case 1:
                    rows = _a.sent();
                    try {
                        res.status(201).send(rows);
                    }
                    catch (err) {
                        return [2 /*return*/, res.status(500).send({
                                error_code: 'SERVER_ERROR',
                                message: 'Unknown error'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/rides', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var rows, totalPages, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getAsync('SELECT * FROM Rides')];
                case 1:
                    rows = _a.sent();
                    try {
                        if (rows.length === 0) {
                            return [2 /*return*/, res.status(500).send({
                                    error_code: 'RIDES_NOT_FOUND_ERROR',
                                    message: 'Could not find any rides'
                                })];
                        }
                        totalPages = Math.ceil(rows.length / 5);
                        page = Number(req.query.page);
                        if (!page) {
                            page = 1;
                        }
                        if (page > totalPages) {
                            page = totalPages;
                        }
                        res.status(200).send({
                            page: page,
                            totalPages: totalPages,
                            rides: rows.slice(page * 5 - 5, page * 5)
                        });
                    }
                    catch (error) {
                        return [2 /*return*/, res.status(500).send({
                                error_code: 'SERVER_ERROR',
                                message: 'Unknown error'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/rides/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getAsync("SELECT * FROM Rides WHERE rideID='" + req.params.id + "'")];
                case 1:
                    rows = _a.sent();
                    try {
                        if (rows.length === 0) {
                            return [2 /*return*/, res.status(200).send({
                                    error_code: 'RIDES_NOT_FOUND_ERROR',
                                    message: 'Could not find any rides'
                                })];
                        }
                        res.status(200).send(rows);
                    }
                    catch (err) {
                        return [2 /*return*/, res.status(500).send({
                                error_code: 'SERVER_ERROR',
                                message: 'Unknown error'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    return app;
};
