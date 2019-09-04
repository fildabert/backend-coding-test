'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

const chai = require("chai");
const chaiExpect = chai.expect;

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });


    describe("GET /rides (Error Case)", () =>{
        it("should return an error message when no rides are found", (done) =>{
            request(app)
                .get("/rides")
                .expect(500, done)
        })
    })

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });


    describe("POST /rides", () =>{
        var data = {
            "start_lat": 10,
            "start_long": 14,
            "end_lat": 10,
            "end_long": 20,
            "rider_name": "POOPY",
            "driver_name": "Filbert",
            "driver_vehicle": "WHATARIDE"
        }
        it("should post a new ride to the database", () =>{
            request(app)
                .post("/rides")
                .send(data)
                .expect(201)
                .then(response =>{
                    var newRide = response.body[0];
                    chaiExpect(newRide).to.be.an("object");
                    chaiExpect(newRide).to.have.property("rideID");
                    chaiExpect(newRide).to.have.property("startLat");
                    chaiExpect(newRide).to.have.property("startLong");
                    chaiExpect(newRide).to.have.property("endLat");
                    chaiExpect(newRide).to.have.property("endLong");
                    chaiExpect(newRide).to.have.property("riderName");
                    chaiExpect(newRide).to.have.property("driverName");
                    chaiExpect(newRide).to.have.property("driverVehicle");
                    chaiExpect(newRide).to.have.property("created");
                })      
        })
        var dataKeys = Object.keys(data)
        
        for(var i = 0; i < dataKeys.length; i++) {
            var errorData = {...data};
            delete errorData[dataKeys[i]]
            it("should return an error message when one of the input is invalid", () =>{
                request(app)
                    .post("/rides")
                    .send(errorData)
                    .expect(400)
                    .then(response =>{
                        // I'm trying to cover all of the validations in POST /rides, but for some reason it only covers 
                        // the validation for rider name (VALIDATION ERROR, message: Rider name must be a non empty string)
                        // even though errorData already has the property rider_name
                        
                        // console.log(errorData);
                        // console.log(response.body)
                    })
                
            })
        }
     
    })

    describe("GET /rides", () =>{
        it("should fetch rides from the database", (done) =>{
            request(app)
                .get("/rides")
                .expect(200, done)
        })
    })
    describe("GET /rides/:id", () =>{
        it("should fetch a ride based on the id", (done) =>{
            request(app)
                .get("/rides/1")
                .expect(200, done)
        })
    })
});