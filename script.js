// ----------------------
// Gestion du Dark Mode avec localStorage
// ----------------------
const toggleDarkMode = document.getElementById("toggleDarkMode");
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}
toggleDarkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isEnabled = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isEnabled ? "enabled" : "disabled");
});

// ----------------------
// Sélecteurs principaux
// ----------------------
const form        = document.getElementById("weatherForm");
const display     = document.getElementById("weatherDisplay");
const range       = document.getElementById("daysRange");
const daysDisplay = document.getElementById("daysDisplay");

// ----------------------
// Mise à jour accessible du slider
// ----------------------
range.addEventListener("input", () => {
  daysDisplay.textContent = range.value;
  range.setAttribute("aria-valuenow", range.value);
});

// ----------------------
// Soumission du formulaire
// ----------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  display.innerHTML = "";

  // ----------------------
  // Affichage d'un loader pendant l'appel API
  // ----------------------
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-live", "polite");
  display.appendChild(loader);

  // Récupération des valeurs du formulaire
  const city     = document.getElementById("city").value.trim();
  const nbDays   = parseInt(range.value, 10);
  const showLat  = document.getElementById("showLat").checked;
  const showLon  = document.getElementById("showLon").checked;
  const showRain = document.getElementById("showRain").checked;
  const showWind = document.getElementById("showWind").checked;
  const showDir  = document.getElementById("showDir").checked;

  try {
    const token    = "8f90229357a23a9f6bf17ca5c2d18038e2307de4b74fd4c6a9939cc7814678bd";
    // 1) Requête pour récupérer l'ID INSEE de la ville
    const resCity  = await fetch(
      `https://api.meteo-concept.com/api/location/city?token=${token}&search=${city}`
    );
    const dataCity = await resCity.json();

    // ----------------------
    // Gestion d'erreur ville introuvable
    // ----------------------
    if (!dataCity.cities || dataCity.cities.length === 0) {
      display.innerHTML = `<p class="error">Ville introuvable. Vérifiez l’orthographe.</p>`;
      return;
    }
    const infoVille = dataCity.cities[0];
    const insee     = infoVille.insee;

    // 2) Requête pour récupérer les prévisions
    const resForecast  = await fetch(
      `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${insee}`
    );
    const dataForecast = await resForecast.json();

    // ----------------------
    // Nettoyage du loader avant affichage
    // ----------------------
    display.innerHTML = "";

    // ----------------------
    // Affichage des cartes météo
    // ----------------------
    dataForecast.forecast
      .slice(0, nbDays)
      .forEach((day) => {
        const card = document.createElement("div");
        card.className = "weather-card";

        // Mise en forme de la date en français
        const dateObj = new Date(day.datetime);
        const opts    = { weekday: "long", day: "numeric", month: "long" };
        const dateFR  = dateObj.toLocaleDateString("fr-FR", opts);

        card.innerHTML = `
          <h3>${infoVille.name} — ${dateFR}</h3>
          <p>Température : <strong>${day.tmin}°C</strong> → <strong>${day.tmax}°C</strong></p>
          ${showLat  ? `<p>Latitude : ${infoVille.lat}</p>` : ""}
          ${showLon  ? `<p>Longitude : ${infoVille.lon}</p>` : ""}
          ${showRain ? `<p>Pluie cumulée : ${day.rr10} mm</p>` : ""}
          ${showWind ? `<p>Vent moyen (10 m) : ${day.wind10m} km/h</p>` : ""}
          ${showDir  ? `<p>Direction du vent : ${day.dirwind10m}°</p>` : ""}
        `;
        display.appendChild(card);
      });
  } catch (err) {
    // ----------------------
    //  Gestion des erreurs réseau ou inattendues
    // ----------------------
    display.innerHTML = `<p class="error">Erreur : ${err.message}</p>`;
  }
});
