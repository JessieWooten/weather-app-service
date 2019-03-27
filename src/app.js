const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express()
const port = process.env.PORT || 3000;

const public = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates')
const partialsPath = path. join(__dirname, '../templates/partials');

app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(public))
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
    res.render('index',{
        title: 'Weather App',
        name: 'Jessie'
    })
})

app.get('/about', (req, res) =>{
    res.render('about', {
        title: 'About Me',
        name: 'Jessie',
        imgURL: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/3bc17663189609.5aa8b5d67f396.jpg'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title:"Help",
        name: 'Jessie',
        message:'This is your help message ya bish'
    })
})

app.get('/weather', (req, res)=>{
    if(!req.query.address)return res.send({error:'Must provide address'})

    geocode(req.query.address, (err, {error, latitude, longitude, location} = {})=>{
        if(err){
            res.send({error: err})
        }else{
            forecast(latitude,longitude,location, (err, response)=>{
                if(err){
                    res.send({error: err})
                }else{
                    res.send({
                        location,
                        address: req.query.address,
                        forecast: response
                    })
                }
            })
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('help', {
        title:"404 Help",
        name: 'Jessie',
        message:'Article not found'
    })
})

app.get('*', (req, res)=>{
    res.render('help', {
        title:"404",
        name: 'Jessie',
        message:'404 Page not found'
    })
})


app.listen(port, ()=>{
    console.log('server running on port '+ port)
});