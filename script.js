// ==================================================
// SMART SHETKARI - SCRIPT.JS
// ==================================================


// ==================================================
// 1. CROP INFORMATION
// ==================================================

function showCropDetails(crop) {

    let detailsBox =
        document.getElementById(crop + "-details");

    if (!detailsBox) {
        return;
    }

    let details = "";


    if (crop === "wheat") {

        details = `
            <h3>🌾 Wheat / गहू</h3>

            <p>
                <strong>Season / हंगाम:</strong>
                Rabi / रब्बी
            </p>

            <p>
                <strong>Water Requirement / पाण्याची गरज:</strong>
                Medium / मध्यम
            </p>

            <p>
                <strong>Duration / कालावधी:</strong>
                120–150 Days
            </p>

            <p>
                <strong>Soil / माती:</strong>
                Loamy Soil / पोयट्याची माती
            </p>
        `;

    }


    else if (crop === "soybean") {

        details = `
            <h3>🌱 Soybean / सोयाबीन</h3>

            <p>
                <strong>Season / हंगाम:</strong>
                Kharif / खरीप
            </p>

            <p>
                <strong>Water Requirement / पाण्याची गरज:</strong>
                Medium / मध्यम
            </p>

            <p>
                <strong>Duration / कालावधी:</strong>
                90–120 Days
            </p>

            <p>
                <strong>Soil / माती:</strong>
                Well-drained Soil
            </p>
        `;

    }


    else if (crop === "maize") {

        details = `
            <h3>🌽 Maize / मका</h3>

            <p>
                <strong>Season / हंगाम:</strong>
                Kharif / Rabi
            </p>

            <p>
                <strong>Water Requirement / पाण्याची गरज:</strong>
                Medium / मध्यम
            </p>

            <p>
                <strong>Duration / कालावधी:</strong>
                90–120 Days
            </p>

            <p>
                <strong>Soil / माती:</strong>
                Fertile Loamy Soil
            </p>
        `;

    }


    else if (crop === "cotton") {

        details = `
            <h3>🌿 Cotton / कापूस</h3>

            <p>
                <strong>Season / हंगाम:</strong>
                Kharif / खरीप
            </p>

            <p>
                <strong>Water Requirement / पाण्याची गरज:</strong>
                Medium / मध्यम
            </p>

            <p>
                <strong>Duration / कालावधी:</strong>
                150–180 Days
            </p>

            <p>
                <strong>Soil / माती:</strong>
                Black Soil / काळी माती
            </p>
        `;
    }


    detailsBox.innerHTML = details;
}



// ==================================================
// 2. CITY WEATHER
// ==================================================

async function getWeatherByCity() {

    let cityElement =
        document.getElementById("city");


    if (!cityElement) {
        return;
    }


    let city =
        cityElement.value.trim();


    if (city === "") {

        alert(
            "कृपया City Name टाका."
        );

        return;
    }


    document.getElementById(
        "weather-loading"
    ).innerHTML =
        "🌦️ Live weather data मिळवत आहे...";


    document.getElementById(
        "weather-result"
    ).innerHTML = "";


    document.getElementById(
        "five-day-forecast"
    ).innerHTML = "";


    try {

        // ------------------------------------------
        // FIND CITY COORDINATES
        // ------------------------------------------

        let locationResponse =
            await fetch(

                "https://geocoding-api.open-meteo.com/v1/search?name=" +

                encodeURIComponent(city) +

                "&count=1&language=en&format=json"

            );


        if (!locationResponse.ok) {

            throw new Error(
                "Location search failed"
            );

        }


        let locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            document.getElementById(
                "weather-loading"
            ).innerHTML = "";


            document.getElementById(
                "weather-result"
            ).innerHTML =

                "❌ हे location सापडले नाही.";


            return;
        }


        let location =
            locationData.results[0];


        let latitude =
            location.latitude;


        let longitude =
            location.longitude;


        // SAVE LOCATION

        window.currentWeatherLatitude =
            latitude;

        window.currentWeatherLongitude =
            longitude;


        window.currentWeatherLocation = {

            latitude:
                latitude,

            longitude:
                longitude

        };


        // ------------------------------------------
        // GET CURRENT + DAILY WEATHER
        // ------------------------------------------

        await getWeatherData(
            latitude,
            longitude,
            location
        );


    }


    catch (error) {

        console.error(error);


        document.getElementById(
            "weather-loading"
        ).innerHTML = "";


        document.getElementById(
            "weather-result"
        ).innerHTML =

            "❌ Live weather data मिळू शकला नाही. कृपया पुन्हा प्रयत्न करा.";

    }

}



// ==================================================
// 3. GET WEATHER DATA
// ==================================================

async function getWeatherData(
    latitude,
    longitude,
    location
) {

    let weatherResponse =
        await fetch(

            "https://api.open-meteo.com/v1/forecast" +

            "?latitude=" +
            latitude +

            "&longitude=" +
            longitude +

            "&current=" +

            "temperature_2m," +
            "relative_humidity_2m," +
            "apparent_temperature," +
            "precipitation," +
            "weather_code," +
            "wind_speed_10m" +

            "&daily=" +

            "weather_code," +
            "temperature_2m_max," +
            "temperature_2m_min," +
            "precipitation_sum," +
            "precipitation_probability_max," +
            "wind_speed_10m_max" +

            "&forecast_days=5" +

            "&timezone=auto"

        );


    if (!weatherResponse.ok) {

        throw new Error(
            "Weather API failed"
        );

    }


    let weatherData =
        await weatherResponse.json();


    displayWeather(
        location,
        weatherData
    );


    displayFiveDayForecast(
        weatherData
    );

}



// ==================================================
// 4. DISPLAY CURRENT WEATHER
// ==================================================

function displayWeather(
    location,
    weatherData
) {

    let current =
        weatherData.current;


    let weatherText =
        getWeatherDescription(
            current.weather_code
        );


    document.getElementById(
        "weather-loading"
    ).innerHTML = "";


    document.getElementById(
        "weather-result"
    ).innerHTML = `

        <div class="weather-card">

            <h2>
                📍 ${location.name}
            </h2>

            <p>
                🌍 ${location.country || ""}
            </p>

            <h1>
                🌡️ ${current.temperature_2m} °C
            </h1>

            <h3>
                ${weatherText}
            </h3>

            <p>
                💧
                <strong>
                    Humidity / आर्द्रता:
                </strong>

                ${current.relative_humidity_2m}%
            </p>

            <p>
                🌧️
                <strong>
                    Precipitation / पर्जन्यमान:
                </strong>

                ${current.precipitation} mm
            </p>

            <p>
                🌡️
                <strong>
                    Feels Like / जाणवणारे:
                </strong>

                ${current.apparent_temperature} °C
            </p>

            <p>
                💨
                <strong>
                    Wind Speed / वाऱ्याचा वेग:
                </strong>

                ${current.wind_speed_10m} km/h
            </p>

            <p>
                🕐
                <strong>
                    Updated / अपडेट:
                </strong>

                ${current.time}
            </p>

        </div>

    `;


    generateWeatherAdvisory(
        current
    );
}



// ==================================================
// 5. MY LOCATION
// ==================================================

function getMyLocation() {

    if (!navigator.geolocation) {

        alert(
            "तुमच्या browser मध्ये Location support नाही."
        );

        return;
    }


    document.getElementById(
        "weather-loading"
    ).innerHTML =
        "📍 तुमचे Location शोधत आहे...";


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            let latitude =
                position.coords.latitude;


            let longitude =
                position.coords.longitude;


            window.currentWeatherLatitude =
                latitude;


            window.currentWeatherLongitude =
                longitude;


            window.currentWeatherLocation = {

                latitude:
                    latitude,

                longitude:
                    longitude

            };


            await getWeatherByCoordinates(
                latitude,
                longitude
            );

        },


        function(error) {

            console.error(error);


            document.getElementById(
                "weather-loading"
            ).innerHTML = "";


            document.getElementById(
                "weather-result"
            ).innerHTML =

                "❌ Location मिळू शकले नाही. Browser मध्ये Location Permission Allow करा.";

        }

    );

}



// ==================================================
// 6. WEATHER BY MY COORDINATES
// ==================================================

async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    try {

        document.getElementById(
            "weather-loading"
        ).innerHTML =
            "📍 Location माहिती शोधत आहे...";


        // ------------------------------------------
        // REVERSE GEOCODING
        // ------------------------------------------

        let locationResponse =
            await fetch(

                "https://api.bigdatacloud.net/data/reverse-geocode-client" +

                "?latitude=" +
                latitude +

                "&longitude=" +
                longitude +

                "&localityLanguage=en"

            );


        let locationData =
            await locationResponse.json();


        let city =
            locationData.city ||
            locationData.locality ||
            "My Location";


        let locality =
            locationData.locality ||
            locationData.city ||
            "";


        let state =
            locationData.principalSubdivision ||
            "";


        let country =
            locationData.countryName ||
            "";


        let postcode =
            locationData.postcode ||
            "";


        let location = {

            name:
                city,

            village:
                locality,

            state:
                state,

            country:
                country,

            postcode:
                postcode

        };


        // GET WEATHER

        await getWeatherData(
            latitude,
            longitude,
            location
        );


    }


    catch (error) {

        console.error(error);


        document.getElementById(
            "weather-loading"
        ).innerHTML = "";


        document.getElementById(
            "weather-result"
        ).innerHTML =

            "❌ Live weather data मिळू शकला नाही.";

    }

}



// ==================================================
// 7. DISPLAY FIVE DAY FORECAST
// ==================================================

function displayFiveDayForecast(
    weatherData
) {

    let daily =
        weatherData.daily;


    if (!daily) {
        return;
    }


    let forecastBox =
        document.getElementById(
            "five-day-forecast"
        );


    if (!forecastBox) {
        return;
    }


    let forecastHTML = `

        <div class="forecast-section">

            <h2>
                📅 पुढील 5 दिवसांचे हवामान
            </h2>

            <p class="forecast-subtitle">
                5-Day Weather Forecast
            </p>

            <div class="forecast-grid">

    `;


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        let date =
            daily.time[i];


        let maxTemp =
            daily.temperature_2m_max[i];


        let minTemp =
            daily.temperature_2m_min[i];


        let rain =
            daily.precipitation_sum[i];


        let rainProbability =
            daily.precipitation_probability_max[i];


        let wind =
            daily.wind_speed_10m_max[i];


        let code =
            daily.weather_code[i];


        let weather =
            getWeatherDescription(code);


        let formattedDate =
            formatForecastDate(date);


        forecastHTML += `

            <div class="forecast-card">

                <h3>
                    📅 ${formattedDate}
                </h3>

                <div class="forecast-icon">
                    ${getWeatherIcon(code)}
                </div>

                <p class="forecast-condition">
                    ${weather}
                </p>

                <p>
                    🌡️
                    <strong>
                        ${minTemp}°C - ${maxTemp}°C
                    </strong>
                </p>

                <p>
                    🌧️
                    <strong>
                        ${rain} mm
                    </strong>
                </p>

                <p>
                    ☔
                    <strong>
                        Rain Chance:
                    </strong>

                    ${rainProbability ?? 0}%
                </p>

                <p>
                    💨
                    <strong>
                        Wind:
                    </strong>

                    ${wind} km/h
                </p>

            </div>

        `;

    }


    forecastHTML += `

            </div>

        </div>

    `;


    forecastBox.innerHTML =
        forecastHTML;
}



// ==================================================
// 8. FORMAT DATE
// ==================================================

function formatForecastDate(
    dateString
) {

    let date =
        new Date(
            dateString + "T00:00:00"
        );


    let days = [

        "रविवार / Sunday",

        "सोमवार / Monday",

        "मंगळवार / Tuesday",

        "बुधवार / Wednesday",

        "गुरुवार / Thursday",

        "शुक्रवार / Friday",

        "शनिवार / Saturday"

    ];


    let day =
        days[date.getDay()];


    let dateText =
        date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    return `
        ${day}
        <br>
        ${dateText}
    `;
}



// ==================================================
// 9. WEATHER ICON
// ==================================================

function getWeatherIcon(
    code
) {

    if (code === 0) {

        return "☀️";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "🌤️";

    }


    if (code === 3) {

        return "☁️";

    }


    if (
        code >= 45 &&
        code <= 48
    ) {

        return "🌫️";

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return "🌧️";

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄️";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌦️";

    }


    if (code >= 95) {

        return "⛈️";

    }


    return "🌦️";
}



// ==================================================
// 10. WEATHER DESCRIPTION
// ==================================================

function getWeatherDescription(
    code
) {

    if (code === 0) {

        return "☀️ Clear Sky / निरभ्र आकाश";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "🌤️ Partly Cloudy / अंशतः ढगाळ";

    }


    if (code === 3) {

        return "☁️ Overcast / पूर्ण ढगाळ";

    }


    if (
        code >= 45 &&
        code <= 48
    ) {

        return "🌫️ Fog / धुके";

    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return "🌧️ Drizzle / Rain / रिमझिम पाऊस / पाऊस";

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄️ Snow / बर्फवृष्टी";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌦️ Rain Showers / पावसाच्या सरी";

    }


    if (code >= 95) {

        return "⛈️ Thunderstorm / वादळी पाऊस";

    }


    return "🌦️ Weather Information / हवामान माहिती";
}



// ==================================================
// 11. GENERAL FARM ADVISORY
// ==================================================

function generateWeatherAdvisory(
    current
) {

    let advisoryBox =
        document.getElementById(
            "farm-advisory"
        );


    if (!advisoryBox) {
        return;
    }


    let rain =
        Number(
            current.precipitation
        ) || 0;


    let temperature =
        Number(
            current.temperature_2m
        ) || 0;


    let wind =
        Number(
            current.wind_speed_10m
        ) || 0;


    let advisory = "";


    if (rain > 0) {

        advisory += `

            <p>
                🌧️
                <strong>
                    पाऊस / Rain:
                </strong>

                सध्या पर्जन्यमान नोंदवले जात आहे.
                अनावश्यक सिंचन करण्यापूर्वी
                जमिनीतील ओलावा तपासा.
            </p>

        `;

    }


    else {

        advisory += `

            <p>
                💧
                <strong>
                    सिंचन / Irrigation:
                </strong>

                सध्या पर्जन्यमान नोंदलेले नाही.
                पिकाची अवस्था आणि जमिनीतील
                ओलावा पाहून सिंचनाचे नियोजन करा.
            </p>

        `;

    }


    if (temperature >= 35) {

        advisory += `

            <p>
                🌡️
                <strong>
                    तापमान / Temperature:
                </strong>

                तापमान जास्त आहे.
                पिकाला पाण्याची उपलब्धता तपासा.
            </p>

        `;

    }


    if (wind >= 30) {

        advisory += `

            <p>
                💨
                <strong>
                    वारा / Wind:
                </strong>

                वाऱ्याचा वेग जास्त आहे.
                पिकांची पाहणी करा.
            </p>

        `;

    }


    advisoryBox.innerHTML = `

        <div class="farm-advisory">

            <h3>
                🌱 आजचा शेती सल्ला
                <br>
                Today's Farm Advisory
            </h3>

            ${advisory}

        </div>

    `;
}



// ==================================================
// 12. CROP ADVISORY
// ==================================================

function showCropAdvisory() {

    let cropElement =
        document.getElementById(
            "advisory-crop"
        );


    let result =
        document.getElementById(
            "crop-advisory-result"
        );


    if (!cropElement || !result) {

        console.error(
            "Crop Advisory elements not found."
        );

        return;
    }


    let crop =
        cropElement.value;


    if (crop === "") {

        result.innerHTML = `

            <div class="crop-advisory-card">

                <p>
                    ⚠️ कृपया आधी पीक निवडा.
                </p>

                <p>
                    Please select a crop first.
                </p>

            </div>

        `;

        return;
    }


    if (
        typeof window.currentWeatherLatitude
        !== "number"
        ||

        typeof window.currentWeatherLongitude
        !== "number"
    ) {

        result.innerHTML = `

            <div class="crop-advisory-card">

                <p>
                    📍 आधी City Search करा
                    किंवा
                    <strong>
                        माझे Location वापरा.
                    </strong>
                </p>

                <p>
                    First search your city
                    or use My Location.
                </p>

            </div>

        `;

        return;
    }


    result.innerHTML = `

        <div class="crop-advisory-card">

            <p>
                🌦️ Live weather तपासत आहे...
            </p>

        </div>

    `;


    getCropAdvisoryWeather(

        window.currentWeatherLatitude,

        window.currentWeatherLongitude,

        crop

    );

}



// ==================================================
// 13. CROP ADVISORY WEATHER
// ==================================================

async function getCropAdvisoryWeather(
    latitude,
    longitude,
    crop
) {

    let result =
        document.getElementById(
            "crop-advisory-result"
        );


    try {

        let response =
            await fetch(

                "https://api.open-meteo.com/v1/forecast" +

                "?latitude=" +
                latitude +

                "&longitude=" +
                longitude +

                "&current=" +

                "temperature_2m," +
                "relative_humidity_2m," +
                "precipitation," +
                "weather_code," +
                "wind_speed_10m" +

                "&timezone=auto"

            );


        if (!response.ok) {

            throw new Error(
                "Weather API failed"
            );

        }


        let weatherData =
            await response.json();


        generateCropWeatherAdvisory(

            crop,

            weatherData.current

        );


    }


    catch (error) {

        console.error(error);


        result.innerHTML = `

            <div class="crop-advisory-card">

                <p>
                    ❌ Live weather data
                    मिळू शकला नाही.
                </p>

            </div>

        `;

    }

}



// ==================================================
// 14. CROP WEATHER ADVISORY
// ==================================================

function generateCropWeatherAdvisory(
    crop,
    current
) {

    let result =
        document.getElementById(
            "crop-advisory-result"
        );


    let temperature =
        Number(
            current.temperature_2m
        ) || 0;


    let humidity =
        Number(
            current.relative_humidity_2m
        ) || 0;


    let rain =
        Number(
            current.precipitation
        ) || 0;


    let wind =
        Number(
            current.wind_speed_10m
        ) || 0;


    let weatherText =
        getWeatherDescription(
            current.weather_code
        );


    let cropName = "";

    let advisory = "";


    // WHEAT

    if (crop === "wheat") {

        cropName =
            "🌾 Wheat / गहू";


        advisory += `

            <p>
                💧
                <strong>
                    Water / पाणी:
                </strong>

                जमिनीतील ओलावा तपासून
                सिंचनाचे नियोजन करा.
            </p>

        `;


        if (rain > 0) {

            advisory += `

                <p>
                    🌧️
                    <strong>
                        Rain / पाऊस:
                    </strong>

                    सध्या पर्जन्यमान नोंदवले आहे.
                    अनावश्यक सिंचन करण्यापूर्वी
                    जमिनीतील ओलावा तपासा.
                </p>

            `;

        }


        if (temperature >= 35) {

            advisory += `

                <p>
                    🌡️
                    <strong>
                        Temperature / तापमान:
                    </strong>

                    तापमान जास्त आहे.
                    पिकातील पाण्याची उपलब्धता तपासा.
                </p>

            `;

        }

    }


    // SOYBEAN

    else if (crop === "soybean") {

        cropName =
            "🌱 Soybean / सोयाबीन";


        advisory += `

            <p>
                💧
                <strong>
                    Water / पाणी:
                </strong>

                जमिनीतील ओलावा तपासा आणि
                आवश्यकतेनुसार पाण्याचे नियोजन करा.
            </p>

        `;


        if (rain > 0) {

            advisory += `

                <p>
                    🌧️
                    <strong>
                        Rain / पाऊस:
                    </strong>

                    पावसानंतर शेतातील
                    पाण्याचा निचरा तपासा.
                </p>

            `;

        }


        if (humidity >= 80) {

            advisory += `

                <p>
                    💧
                    <strong>
                        Humidity / आर्द्रता:
                    </strong>

                    आर्द्रता जास्त आहे.
                    पिकाची नियमित पाहणी करा.
                </p>

            `;

        }

    }


    // MAIZE

    else if (crop === "maize") {

        cropName =
            "🌽 Maize / मका";


        advisory += `

            <p>
                💧
                <strong>
                    Water / पाणी:
                </strong>

                पिकाची अवस्था आणि जमिनीतील
                ओलावा पाहून सिंचनाचे नियोजन करा.
            </p>

        `;


        if (wind >= 30) {

            advisory += `

                <p>
                    💨
                    <strong>
                        Wind / वारा:
                    </strong>

                    वाऱ्याचा वेग जास्त आहे.
                    पिकाची पाहणी करा.
                </p>

            `;

        }

    }


    // COTTON

    else if (crop === "cotton") {

        cropName =
            "🌿 Cotton / कापूस";


        advisory += `

            <p>
                💧
                <strong>
                    Water / पाणी:
                </strong>

                जमिनीतील ओलावा तपासून
                सिंचनाचे नियोजन करा.
            </p>

        `;


        if (rain > 0) {

            advisory += `

                <p>
                    🌧️
                    <strong>
                        Rain / पाऊस:
                    </strong>

                    पावसानंतर शेतात
                    पाणी साचले आहे का
                    ते तपासा.
                </p>

            `;

        }

    }


    advisory += `

        <hr>

        <h4>
            🌦️ Live Weather / सध्याचे हवामान
        </h4>

        <p>
            🌡️
            <strong>
                Temperature / तापमान:
            </strong>

            ${temperature} °C
        </p>

        <p>
            🌤️
            <strong>
                Condition / स्थिती:
            </strong>

            ${weatherText}
        </p>

        <p>
            💧
            <strong>
                Humidity / आर्द्रता:
            </strong>

            ${humidity}%
        </p>

        <p>
            🌧️
            <strong>
                Precipitation / पर्जन्यमान:
            </strong>

            ${rain} mm
        </p>

        <p>
            💨
            <strong>
                Wind / वारा:
            </strong>

            ${wind} km/h
        </p>

        <hr>

        <p>
            ℹ️
            <strong>
                सूचना / Note:
            </strong>

            हा सल्ला सध्याच्या हवामानावर
            आधारित सामान्य मार्गदर्शन आहे.
        </p>

    `;


    result.innerHTML = `

        <div class="crop-advisory-card">

            <h3>
                ${cropName}
            </h3>

            <h4>
                🌱 Weather-Based Farm Advisory
                <br>
                हवामानावर आधारित शेती सल्ला
            </h4>

            ${advisory}

        </div>

    `;

}