// public/js/main.js

window.initMap = function () {
  console.log("Google Maps API loaded.");
};

document.addEventListener("DOMContentLoaded", async () => {
  var apiKey = await fetch("/google").then((res) => res.json());
  var script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey.key}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  const weatherForm = document.getElementById("weatherForm");
  const weatherDataDiv = document.getElementById("weatherData");
  const mapDataDiv = document.getElementById("mapData");
  const backgroundImageContainer = document.getElementsByTagName("body");

  let mapDiv = document.getElementById("map");
  let map; // Declare a variable to hold the map instance

  weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    if (city !== "") {
      try {
        // Fetch weather data
        const weatherResponse = await fetch(`/weather/${city}`);
        const weatherData = await weatherResponse.json();

        // Fetch geolocation data
        const mapResponse = await fetch(`/map/${city}`);
        const mapData = await mapResponse.json();

        // Display background image
        const backgroundImageURL = weatherData.background;
        console.log("Background image URL:", backgroundImageURL);
        console.log("Weather Data:", weatherData);
        backgroundImageContainer[0].style.backgroundImage = `url(${backgroundImageURL})`;

        // Check for errors in weather and map dataweather.
        if (weatherData && !weatherData.error && mapData && !mapData.error) {
          // Display weather data
          weatherDataDiv.innerHTML = `<p class="d-flex"><strong>Temperature:</strong> ${
            weatherData.weather.temperature || "N/A"
          } °C</p>
                                        <p class="d-flex"><strong>Description:</strong> ${
                                          weatherData.weather.description ||
                                          "N/A"
                                        }</p>
                                        <p class="d-flex"><strong>Icon:</strong> <img src="${
                                          weatherData.weather.icon
                                        }" alt="Weather Icon"></p>
                                        <p class="d-flex"><strong>Feels Like:</strong> ${
                                          weatherData.weather.feels_like ||
                                          "N/A"
                                        } °C</p>
                                        <p class="d-flex"><strong>Humidity:</strong> ${
                                          weatherData.weather.humidity || "N/A"
                                        }%</p>
                                        <p class="d-flex"><strong>Pressure:</strong> ${
                                          weatherData.weather.pressure || "N/A"
                                        } hPa</p>
                                        <p class="d-flex"><strong>Wind Speed:</strong> ${
                                          weatherData.weather.wind_speed ||
                                          "N/A"
                                        } m/s</p>
                                        <p class="d-flex"><strong>Country Code:</strong> ${
                                          weatherData.weather.country_code ||
                                          "N/A"
                                        }</p>
                                        <p class="d-flex"><strong>Rain:</strong> ${
                                          weatherData.weather.rain || "N/A"
                                        } mm</p>`;

          // Display map data
          mapDataDiv.innerHTML = `<p class="d-flex"><strong>Latitude:</strong> ${mapData.latitude}</p>
                                    <p class="d-flex"><strong>Longitude:</strong> ${mapData.longitude}</p>`;

          // Initialize the map if not already initialized
          if (!map) {
            map = new google.maps.Map(document.getElementById("map"), {
              center: {
                lat: parseFloat(mapData.latitude),
                lng: parseFloat(mapData.longitude),
              },
              zoom: 10, // Adjust the zoom level as needed
            });
          } else {
            // Update the map center if already initialized
            map.setCenter({
              lat: parseFloat(mapData.latitude),
              lng: parseFloat(mapData.longitude),
            });
          }
        } else {
          console.error(
            "Error fetching weather data:",
            weatherData && weatherData.error
          );
          console.error("Error fetching map data:", mapData && mapData.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      alert("Please enter a city.");
    }
  });
});
