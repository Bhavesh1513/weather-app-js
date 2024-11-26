const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const currentLocationButton = document.getElementById("currentLocationButton");
const weatherDisplay = document.getElementById("weatherDisplay");
const forecastDisplay = document.getElementById("forecastDisplay");
const suggestions = document.getElementById("suggestions");

// Initial State
function initializeApp() {
  weatherDisplay.innerHTML = `
    <p class="text-gray-500 text-center ">Search for a city to view the weather details.</p>
  `;
  forecastDisplay.innerHTML = `
    <p class="text-gray-500 text-center ">Search for a city to view the 5-day forecast.</p>
  `;
  updateSuggestions();
}

// Update Dropdown Suggestions
function updateSuggestions() {
  if (recentCities.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }
  suggestions.innerHTML = recentCities
    .map(city => `<div class="p-2 hover:bg-gray-200 cursor-pointer">${city}</div>`)
    .join("");
  suggestions.classList.remove("hidden");
}

// Fetch Weather Data
async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
    return data;
  } catch (error) {
    weatherDisplay.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
  }
}

// Fetch 5-day Forecast Data
async function fetchForecast(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    forecastDisplay.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
  }
}

// Display Current Weather Data
function displayWeather(data) {
  weatherDisplay.innerHTML = `
    <h2 class="text-center text-2xl font-bold">${data.name}</h2>
    <div class="flex justify-center items-center space-x-4 mt-4">
      <img 
        src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
        alt="${data.weather[0].description}" 
        class="w-16 h-16"
      />
      <div>
        <p class="text-lg">${data.weather[0].description}</p>
        <p class="text-xl font-semibold">${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      </div>
    </div>
  `;
}

// Display 5-day Forecast Data
function displayForecast(data) {
  const days = [];
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.getDate();
    if (!days.includes(day)) {
      days.push(day);
    }
  });

  forecastDisplay.innerHTML = days.map(day => {
    const forecastForDay = data.list.filter(item => new Date(item.dt * 1000).getDate() === day)[0];
    return `
      <div class="bg-white p-4 rounded-lg shadow-md text-center">
        <p class="font-bold">${new Date(forecastForDay.dt * 1000).toLocaleDateString()}</p>
        <img 
          src="http://openweathermap.org/img/wn/${forecastForDay.weather[0].icon}@2x.png" 
          alt="${forecastForDay.weather[0].description}" 
          class="w-16 h-16 mx-auto"
        />
        <p>${forecastForDay.weather[0].description}</p>
        <p class="font-semibold">${forecastForDay.main.temp}°C</p>
        <p>Humidity: ${forecastForDay.main.humidity}%</p>
        <p>Wind Speed: ${forecastForDay.wind.speed} m/s</p>
      </div>
    `;
  }).join('');
}

searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    weatherDisplay.innerHTML = `<p class="text-red-500 text-center">Please enter a city name.</p>`;
    return;
  }
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
    updateSuggestions();
  }

  // Fetch both current weather and 5-day forecast
  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
});

// Search Weather by Current Location
currentLocationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;
      fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
      fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    },
    () => {
      weatherDisplay.innerHTML = `<p class="text-red-500 text-center">Unable to retrieve location.</p>`;
    }
  );
});

// Handle Suggestions Click
suggestions.addEventListener("click", (e) => {
  if (e.target && e.target.nodeName === "DIV") {
    const city = e.target.textContent;
    cityInput.value = city;
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  }
});

// Show Suggestions on Input Focus
cityInput.addEventListener("focus", updateSuggestions);

// Hide Suggestions on Input Blur
cityInput.addEventListener("blur", () => {
  setTimeout(() => suggestions.classList.add("hidden"), 200);
});

// Initialize App
initializeApp();
