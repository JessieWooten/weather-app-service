const path = require("path");
const express = require("express");
const hbs = require("hbs");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// Cache
const createAppCache = require("./cache");
const {
  images: imageCache,
  geolocation: geolocationCache,
  forecast: forecastCache,
} = createAppCache([
  { key: "images" }, // duration defaults to 5 minutes
  { key: "geolocation", duration: 172800000 }, // 48 hours
  { key: "forecast" },
]);
module.exports.imageCache = imageCache;
module.exports.geolocationCache = geolocationCache;
module.exports.forecastCache = forecastCache;
// Services
const fetchGeocode = require("./utils/geocode");
const fetchForecast = require("./utils/forecast");
const fetchImageByKeyword = require("./utils/image");
// Middleware
const validateWeatherQuery = require("./middleware/validateWeatherQuery");
const app = express();
const port = process.env.PORT || 3000;

const public = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(cors());
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

    const keyword =
      weatherForcast.temperature < 32
        ? `cold ${weatherForcast.icon}`
        : weatherForcast.icon;
    const image = await fetchImageByKeyword(keyword);

    res.send({
      location,
      forecast: weatherForcast,
      image,
    });
  } catch (e) {
    const { status, body } = e;
    console.log("{ERROR}:", e);
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
