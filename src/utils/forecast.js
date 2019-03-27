const request = require('request');

const forecast = (lat, long, location, callback) => {
    let url = 'https://api.darksky.net/forecast/3ab5723c8d0e5cd170cd1895a969eccd/' + `${lat},${long}`;
    request.get({url, json:true}, (error,{body})=>{
        if(error){
            callback("FORECAST ERROR")
            // console.error('Get Weather Errror: ', err);
        }else if(body.error){
            callback("Couldnt get weather")
        }else{
            const data = body;
            const {summary} = data.daily;
            let msg = `It is currently ${data.currently.temperature} degrees and there is a ${data.currently.precipProbability}% chance of rain in ${location}.`
           callback(undefined, summary+'\n'+msg); 
        }
    })
}

module.exports = forecast;