const path = require("path");
const express = require("express");
const hbs = require("hbs");
const fetchGeocode = require("./utils/geocode");
const fetchForecast = require("./utils/forecast");
// const validateWeatherQuery = require("../middleware/validateWeatherQuery");
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

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Jessie",
    imgURL:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/3bc17663189609.5aa8b5d67f396.jpg",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Jessie",
    message: "This is your help message ya bish",
  });
});

app.get("/weather", async (req, res) => {
  try {
    if (!req.query.address && !(req.query.latitude && req.query.latitude)) {
      return res.status(400).send({ message: "Must provide location" });
    }

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

app.get("/help/*", (req, res) => {
  res.render("help", {
    title: "404 Help",
    name: "Jessie",
    message: "Article not found",
  });
});

app.get("*", (req, res) => {
  res.render("help", {
    title: "404",
    name: "Jessie",
    message: "404 Page not found",
  });
});

app.listen(port, () => {
  console.log("server running on port " + port);
});
