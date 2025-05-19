const form = document.getElementById("weatherForm");
const display = document.getElementById("weatherDisplay");
const range = document.getElementById("daysRange");
const daysDisplay = document.getElementById("daysDisplay");

// Change le nombre de jours affiché dynamiquement
range.addEventListener("input", () => {
    daysDisplay.textContent = range.value;
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    display.innerHTML = "";

    const city = document.getElementById("city").value;
    const nbDays = parseInt(range.value);
    const showLat = document.getElementById("showLat").checked;
    const showLon = document.getElementById("showLon").checked;
    const showRain = document.getElementById("showRain").checked;
    const showWind = document.getElementById("showWind").checked;
    const showDir = document.getElementById("showDir").checked;

    try {
        const token = "8f90229357a23a9f6bf17ca5c2d18038e2307de4b74fd4c6a9939cc7814678bd";
        const response = await fetch(`https://api.meteo-concept.com/api/location/city?token=${token}&search=${city}`);
        const data = await response.json();
        if (!data.cities.length) throw new Error("Ville introuvable.");
        const cityId = data.cities[0].insee;

        const forecast = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${cityId}`);
        const forecastData = await forecast.json();

        for (let i = 0; i < nbDays; i++) {
            const day = forecastData.forecast[i];
            const card = document.createElement("div");
            card.className = "weather-card";
            card.innerHTML = `
                <h3>Jour ${i + 1}</h3>
                <p>Température : ${day.tmin}°C - ${day.tmax}°C</p>
                ${showLat ? `<p>Latitude : ${data.cities[0].lat}</p>` : ""}
                ${showLon ? `<p>Longitude : ${data.cities[0].lon}</p>` : ""}
                ${showRain ? `<p>Pluie : ${day.rr10} mm</p>` : ""}
                ${showWind ? `<p>Vent : ${day.wind10m} km/h</p>` : ""}
                ${showDir ? `<p>Direction : ${day.dirwind10m}°</p>` : ""}
            `;
            display.appendChild(card);
        }
    } catch (error) {
        display.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
});