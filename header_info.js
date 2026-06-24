const headerDateTime=document.getElementById("headerDateTime");
const headerWeather=document.getElementById("headerWeather");

const DAYS=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const MONTHS=["january","february","march","april","may","june",
              "july","august","september","october","november","december"];

function updateDateTime(){
    const now=new Date();
    const day=DAYS[now.getDay()];
    const month=MONTHS[now.getMonth()];
    const date=now.getDate();
    const year=now.getFullYear();

    const hh=String(now.getHours()).padStart(2,"0");
    const mm=String(now.getMinutes()).padStart(2,"0");
    const ss=String(now.getSeconds()).padStart(2,"0");

    headerDateTime.textContent=
        `${day} | ${month} ${date}, ${year} | ${hh}:${mm}:${ss}`;
}

updateDateTime();
setInterval(updateDateTime,1000);

async function fetchLocationAndWeather(){

    try{

        const geoRes=await fetch("https://ip-api.com/json/?fields=status,city,regionName,lat,lon");
        const geo=await geoRes.json();

        if(geo.status!=="success") throw new Error("geo failed");

        const city=geo.city||"";
        const region=geo.regionName||"";
        const locationLabel=
            [city,region]
            .filter(Boolean)
            .join(", ")
            .toLowerCase();

        const lat=geo.lat.toFixed(4);
        const lon=geo.lon.toFixed(4);

        const weatherRes=await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m&temperature_unit=celsius&forecast_days=1`
        );
        const weather=await weatherRes.json();

        const temp=Math.round(weather.current.temperature_2m);

        headerWeather.textContent=`${temp}°C | ${locationLabel} | ${lat}, ${lon}`;

    }catch(e){

        headerWeather.textContent="";
    }
}

fetchLocationAndWeather();
