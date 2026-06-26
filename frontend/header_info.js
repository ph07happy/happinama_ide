const headerDateTime = document.getElementById("headerDateTime");
const headerWeather = document.getElementById("headerWeather");

function updateDateTime() {
    const now = new Date();
    const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const pad = n => String(n).padStart(2, "0");
    headerDateTime.textContent = `${DAYS[now.getDay()]} | ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} | ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

async function fetchWeather(lat, lon, city) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=celsius&forecast_days=1`);
    const data = await res.json();
    headerWeather.textContent = `${Math.round(data.current.temperature_2m)}°C | ${city.toLowerCase()} | ${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}`;
}

async function fetchLocationAndWeather() {
    try {
        const geoRes = await fetch("https://ip-api.com/json/?fields=status,city,lat,lon");
        const geo = await geoRes.json();
        if (geo.status !== "success") throw new Error();
        await fetchWeather(geo.lat, geo.lon, geo.city);
    } catch {
        try {
            const fallbackRes = await fetch("https://ipapi.co/json/");
            const fallback = await fallbackRes.json();
            await fetchWeather(fallback.latitude, fallback.longitude, fallback.city);
        } catch {
            headerWeather.textContent = "";
        }
    }
}
fetchLocationAndWeather();
