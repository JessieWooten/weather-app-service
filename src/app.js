const path = require("path");
const express = require("express");
const hbs = require("hbs");
const fetchGeocode = require("./utils/geocode");
const fetchForecast = require("./utils/forecast");
const validateWeatherQuery = require("./middleware/validateWeatherQuery");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const public = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(express.static(public));
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Jessie",
  });
});

app.get("/weather", validateWeatherQuery, async (req, res) => {
  try {
    const locationData = req.query.address
      ? await fetchGeocode(req.query.address)
      : { latitude: req.query.latitude, longitude: req.query.latitude };
    const { latitude, longitude, location } = locationData;

    const weatherForcast = await fetchForecast(latitude, longitude);

    res.send({
      location,
      //   address: req.query.address,
      forecast: weatherForcast,
    });
  } catch (e) {
    const { status, body } = e;
    res.status(status || 500).send(body || e);
  }
});

app.get("*", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Jessie",
  });
});

app.listen(port, () => {
  console.log("server running on port " + port);
});
