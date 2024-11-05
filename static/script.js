// Your WeatherAPI.com key
const apiKey = "e9e6a5f590e3497695f135601242910";

let isCelsius = true; // Flag to track the current temperature unit

// Function to fetch weather data for a city
async function getWeather() {
    const city = document.getElementById("city").value;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found or unauthorized");

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
    }
}

// Function to get weather based on current location
async function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Unable to retrieve weather data.");

                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
            }
        }, (error) => {
            console.error(error);
            alert("Unable to retrieve your location. Please check your browser settings.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to display weather data
function displayWeather(data) {
    const { location, current } = data;
    console.log("Weather Data:", data);
    console.log("Condition Icon URL:", current.condition.icon);
    // Convert temperature based on the selected unit
    const previousTemp = isCelsius ? current.temp_c - 1 : (current.temp_c - 1) * 9 / 5 + 32; // Simulating yesterday's temperature
    const currentTemp = isCelsius ? current.temp_c : (current.temp_c * 9 / 5) + 32; // Current temperature
    const nextTemp = isCelsius ? current.temp_c + 1 : (current.temp_c + 1) * 9 / 5 + 32; // Simulating tomorrow's temperature

    // Create the weather HTML for each column
    const previousWeatherHTML = `
        <p>Temperature: ${previousTemp.toFixed(1)}°${isCelsius ? 'C' : 'F'}</p>
        <p>Condition: ${current.condition.text}</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_kph} kph</p>
        <img src="${current.condition.icon}" alt="${current.condition.text}">
    `;

    const currentWeatherHTML = `
        <p>Temperature: ${currentTemp.toFixed(1)}°${isCelsius ? 'C' : 'F'}</p>
        <p>Condition: ${current.condition.text}</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_kph} kph</p>
        <img src="${current.condition.icon}" alt="${current.condition.text}">
    `;

    const nextWeatherHTML = `
        <p>Temperature: ${nextTemp.toFixed(1)}°${isCelsius ? 'C' : 'F'}</p>
        <p>Condition: ${current.condition.text}</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_kph} kph</p>
        <img src="${current.condition.icon}" alt="${current.condition.text}">
    `;

    // Update the respective columns with the weather data
    document.getElementById("previousWeather").innerHTML = previousWeatherHTML;
    document.getElementById("currentWeather").innerHTML = currentWeatherHTML;
    document.getElementById("nextWeather").innerHTML = nextWeatherHTML;

    // Show the weather columns after fetching data
    document.getElementById("weatherResult").style.display = "block";
}

// Function to toggle temperature unit
function toggleTemperature() {
    isCelsius = !isCelsius; // Toggle the unit
    const city = document.getElementById("city").value;
    if (city) {
        getWeather(); // Fetch weather again to update temperatures
    } else {
        getCurrentLocation(); // Fetch weather for the current location if no city is entered
    }
}

// Initially hide the weather columns
document.getElementById("weatherResult").style.display = "none";
