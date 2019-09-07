## Setup
1. Run `npm install`
2. Run `npm test`
3. Run `npm start`
4. Hit the server to test health `curl localhost:8010/health` and expect a `200` response

## Rides Schema
| Key | Type | Description |
| --- | ---- | ----------- |
|riderId|Integer|Rider Id|
|startLat|Integer|Start Latitude|
|startLong|Integer|Start Longtitude|
|endLat|Integer|End Latitude|
|endLong|Integer|End Longtitude|
|riderName|String|Rider Name|
|driverName|String|Driver Name|
|driverVehicle|String|Driver Vehicle|
|created|Date|Date where new rider is created|

## API End Points

### Adding a new ride
```
HTTP Method: POST
url: http://localhost:8010/rides
body:
    {
        "rideID": 2,
        "startLat": 10,
        "startLong": 14,
        "endLat": 10,
        "endLong": 20,
        "riderName": "POOPY",
        "driverName": "Filbert",
        "driverVehicle": "WHATARIDE",
        "created": "2019-09-07 01:53:17"
    }
```
```
result: 
[
    {
        "rideID": 2,
        "startLat": 10,
        "startLong": 14,
        "endLat": 10,
        "endLong": 20,
        "riderName": "POOPY",
        "driverName": "Filbert",
        "driverVehicle": "WHATARIDE",
        "created": "2019-09-07 01:53:17"
    }
]
```

### Get all rides
```
HTTP Method: GET
url: http://localhost:8010/rides?page={pageNumber}
```

```
result: 
{
  "page": 1,
  "totalPages": 1,
  "rides": [
    {
      "rideID": 1,
      "startLat": 10,
      "startLong": 14,
      "endLat": 10,
      "endLong": 20,
      "riderName": "POOPY",
      "driverName": "Filbert",
      "driverVehicle": "WHATARIDE",
      "created": "2019-09-07 01:53:09"
    },
    {
      "rideID": 2,
      "startLat": 10,
      "startLong": 14,
      "endLat": 10,
      "endLong": 20,
      "riderName": "POOPY",
      "driverName": "Filbert",
      "driverVehicle": "WHATARIDE",
      "created": "2019-09-07 01:53:17"
    }
  ]
}
```

### Get ride by ID
```
HTTP Method: GET
url: http://localhost:8010/rides/:id
```
```
result:
[
  {
    "rideID": 1,
    "startLat": 10,
    "startLong": 14,
    "endLat": 10,
    "endLong": 20,
    "riderName": "POOPY",
    "driverName": "Filbert",
    "driverVehicle": "WHATARIDE",
    "created": "2019-09-07 01:53:09"
  }
]
```
