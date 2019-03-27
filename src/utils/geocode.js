const request = require('request');

const geocode = (address, callback) => {
    url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoianNobW9uZXkiLCJhIjoiY2p0MGx1eDEyMDl2MzQ5cDltdTY3NXV3ZyJ9._z08AfC1lj0ZCKtE8knZnQ`
    request.get({url, json: true},  (err, {body})=>{
        if(err){
            callback('GEOCODE ERROR', undefined);
        }else if(body.error || !body.hasOwnProperty('features') || body.features.length === 0){
            callback('No location found', undefined)
        }else{
            let data = body.features[0];
            callback(undefined, {
                latitude: data.center[1],
                longitude: data.center[0],
                location: data.place_name
            });
        }
    })
}

module.exports = geocode;