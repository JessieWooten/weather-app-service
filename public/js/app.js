const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  let el = document.getElementById("msg");
  try {
    e.preventDefault();
    setMessage(el, "loading...");
    let address = document.querySelector("input").value.trim();
    if (address === "") {
      address = await getBrowserLocation();
    }
    const query =
      typeof address === "string"
        ? `address=${address}`
        : `latitude=${address.latitude}&longitude=${address.longitude}`;
    const { forecast } = await fetch(`/weather?${query}`).then((res) =>
      res.json()
    );

    let msg = `It is currently ${
      forecast.currently.temperature
    } degrees and there is a ${
      forecast.currently.precipProbability
    }% chance of rain in ${forecast.location || "your area"}.`;
    setMessage(el, msg);
  } catch (error) {
    setMessage(el, JSON.stringify(error), "error");
  }
});

function setMessage(el, msg, className = "") {
  el.textContent = msg;
  className ? (el.classList = [className]) : (el.classList = []);
}

async function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (
      !navigator ||
      !navigator.geolocation ||
      !navigator.geolocation.getCurrentPosition
    ) {
      return reject("Couldn;t find getCurrentPosition");
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      reject,
      options
    );
  });
}
