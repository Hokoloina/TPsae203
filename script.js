// ===========================
// CONST & SÉLECTEURS
// ===========================
const TOKEN       = "8f90229357a23a9f6bf17ca5c2d18038e2307de4b74fd4c6a9939cc7814678bd";
const GOV_API_URL = "https://geo.api.gouv.fr/communes";

const form        = document.getElementById("weatherForm");
const display     = document.getElementById("weatherDisplay");
const range       = document.getElementById("daysRange");
const daysDisplay = document.getElementById("daysDisplay");
const toggleDM    = document.getElementById("toggleDarkMode");

// ===========================
// DARK MODE (persistant)
// ===========================
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}
toggleDM.addEventListener("click", () => {
  const isOn = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isOn ? "enabled" : "disabled");
});

// ===========================
// SLIDER ACCESSIBLE
// ===========================
range.addEventListener("input", () => {
  daysDisplay.textContent = range.value;
  range.setAttribute("aria-valuenow", range.value);
});

// ===========================
// APPEL GEOAPI POUR CODE INSEE
// ===========================
async function fetchCommuneByName(nomVille) {
  const url = `${GOV_API_URL}`
    + `?nom=${encodeURIComponent(nomVille)}`
    + `&fields=code,nom,centre`
    + `&boost=population`
    + `&limit=1`;

  const res  = await fetch(url);
  if (!res.ok) throw new Error(`Erreur GeoAPI : ${res.status}`);
  const data = await res.json();

  // Vérifie que l'API renvoie bien un tableau non vide
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Commune introuvable (GeoAPI)");
  }

  // data[0].code = code INSEE, data[0].centre.coordinates = [lon, lat]
  return {
    insee: data[0].code,
    name:  data[0].nom,
    lat:   data[0].centre.coordinates[1],
    lon:   data[0].centre.coordinates[0]
  };
}

// ===========================
// SOUMISSION DU FORMULAIRE
// ===========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  display.innerHTML = "";

  // Affiche le loader
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.setAttribute("role", "status");
  display.appendChild(loader);

  // Récupère valeurs user
  const cityRaw = document.getElementById("city").value.trim();
  if (!cityRaw) {
    display.innerHTML = `<p class="error">Merci d’entrer une ville.</p>`;
    return;
  }
  const nbDays   = parseInt(range.value, 10);
  const showLat  = document.getElementById("showLat").checked;
  const showLon  = document.getElementById("showLon").checked;
  const showRain = document.getElementById("showRain").checked;
  const showWind = document.getElementById("showWind").checked;
  const showDir  = document.getElementById("showDir").checked;

  try {
    // 1) Récupère code INSEE via GeoAPI
    const commune = await fetchCommuneByName(cityRaw);
    console.log("✅ Commune trouvée :", commune);

    // 2) Appel Météo-Concept avec le code INSEE
    const urlMeteo = `https://api.meteo-concept.com/api/forecast/daily`
      + `?token=${TOKEN}&insee=${commune.insee}`;

    const resM = await fetch(urlMeteo);
    if (!resM.ok) throw new Error(`Erreur Météo-Concept : ${resM.status}`);
    const dataM = await resM.json();
    console.log("✅ Prévisions reçues :", dataM);

    // Enlève le loader
    display.innerHTML = "";

    // Affiche les cartes météo
    dataM.forecast.slice(0, nbDays).forEach(day => {
      const dateFR = new Date(day.datetime).toLocaleDateString("fr-FR", {
        weekday: 'long', day: 'numeric', month: 'long'
      });

      const card = document.createElement("div");
      card.className = "weather-card";
      card.innerHTML = `
        <h3>${commune.name} — ${dateFR}</h3>
        <p>Temp : <strong>${day.tmin}°C</strong> → <strong>${day.tmax}°C</strong></p>
        ${showLat  ? `<p>Latitude : ${commune.lat}</p>` : ""}
        ${showLon  ? `<p>Longitude : ${commune.lon}</p>` : ""}
        ${showRain ? `<p>Pluie cumulée : ${day.rr10} mm</p>` : ""}
        ${showWind ? `<p>Vent moyen (10 m) : ${day.wind10m} km/h</p>` : ""}
        ${showDir  ? `<p>Direction du vent : ${day.dirwind10m}°</p>` : ""}
      `;
      display.appendChild(card);
    });
  }
  catch (err) {
    console.error(err);
    display.innerHTML = `<p class="error">${err.message}</p>`;
  }
});
