const path = require("path");
const express = require("express");
const hbs = require("hbs");
const dotenv = require("dotenv");
const cors = require("cors");
// Services
const fetchGeocode = require("./utils/geocode");
const fetchForecast = require("./utils/forecast");
const fetchImageByKeyword = require("./utils/image");
// Middleware
const validateWeatherQuery = require("./middleware/validateWeatherQuery");
// Cache
const imageCache = require("./cache/images");
const ImageCache = imageCache();

dotenv.config();
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
    const cachedImage = ImageCache.getImageByKey(keyword);
    const image = cachedImage || (await fetchImageByKeyword(keyword));

    if (cachedImage === undefined) {
      // if no cached image, save the imgage response
      ImageCache.setImage(weatherForcast.icon, image);
    }

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
