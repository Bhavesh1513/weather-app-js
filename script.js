// API Key for OpenWeatherMap API
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// Fetch recent cities from localStorage or initialize as an empty array if none exist
const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// DOM Elements (references to HTML elements)
const cityInput = document.getElementById("cityInput");  // Input field for city name
const searchButton = document.getElementById("searchButton");  // Button to trigger weather search
const currentLocationButton = document.getElementById("currentLocationButton");  // Button to fetch weather based on current location
const weatherDisplay = document.getElementById("weatherDisplay");  // Display area for current weather data
const forecastDisplay = document.getElementById("forecastDisplay");  // Display area for 5-day forecast
const suggestions = document.getElementById("suggestions");  // Dropdown for recent city suggestions

// Initial State: Display a message asking the user to search for a city
function initializeApp() {
  weatherDisplay.innerHTML = `
    <p class="text-gray-500 text-center ">Search for a city to view the weather details.</p>
  `;
  forecastDisplay.innerHTML = `
    <p class="text-gray-500 text-center ">Search for a city to view the 5-day forecast.</p>
  `;
  updateSuggestions();  // Update the suggestions dropdown with recent cities
}

// Update the dropdown suggestions with recent cities from localStorage
function updateSuggestions() {
  // Hide suggestions if no recent cities exist
  if (recentCities.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }
  // Generate the HTML for each recent city and display them in the suggestions dropdown
  suggestions.innerHTML = recentCities
    .map(city => `<div class="p-2 hover:bg-gray-200 cursor-pointer">${city}</div>`)
    .join("");
  suggestions.classList.remove("hidden");  // Show the suggestions dropdown
}

// Fetch current weather data from the OpenWeatherMap API
async function fetchWeather(url) {
  try {
    const response = await fetch(url);  // Fetch data from the API
    if (!response.ok) throw new Error("City not found");  // Handle errors if city not found
    const data = await response.json();  // Parse the JSON response
    displayWeather(data);  // Display the weather data
    return data;  // Return data for further use if needed
  } catch (error) {
    // If an error occurs, display an error message
    weatherDisplay.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
  }
}

// Fetch the 5-day weather forecast data from the OpenWeatherMap API
async function fetchForecast(url) {
  try {
    const response = await fetch(url);  // Fetch forecast data from the API
    if (!response.ok) throw new Error("City not found");  // Handle errors if city not found
    const data = await response.json();  // Parse the JSON response
    displayForecast(data);  // Display the forecast data
  } catch (error) {
    // If an error occurs, display an error message
    forecastDisplay.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
  }
}

// Display current weather data
function displayWeather(data) {
  weatherDisplay.innerHTML = `
    <h2 class="text-center text-2xl font-bold">${data.name}</h2>  <!-- City name -->
    <div class="flex justify-center items-center space-x-4 mt-4">
      <img 
        src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
        alt="${data.weather[0].description}" 
        class="w-16 h-16"
      />
      <div>
        <p class="text-lg">${data.weather[0].description}</p>  <!-- Weather description -->
        <p class="text-xl font-semibold">${data.main.temp}°C</p>  <!-- Temperature in Celsius -->
        <p>Humidity: ${data.main.humidity}%</p>  <!-- Humidity percentage -->
        <p>Wind Speed: ${data.wind.speed} m/s</p>  <!-- Wind speed -->
      </div>
    </div>
  `;
}

// Display 5-day forecast data
function displayForecast(data) {
  const days = [];
  // Loop through forecast data and collect unique days
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);  // Convert timestamp to Date object
    const day = date.getDate();  // Get the day of the month
    if (!days.includes(day)) {
      days.push(day);  // Add the day to the days array if not already included
    }
  });

  // Generate the forecast display for each unique day
  forecastDisplay.innerHTML = days.map(day => {
    const forecastForDay = data.list.filter(item => new Date(item.dt * 1000).getDate() === day)[0];
    return `
      <div class="bg-white p-4 rounded-lg shadow-md text-center">
        <p class="font-bold">${new Date(forecastForDay.dt * 1000).toLocaleDateString()}</p>  <!-- Date of forecast -->
        <img 
          src="http://openweathermap.org/img/wn/${forecastForDay.weather[0].icon}@2x.png" 
          alt="${forecastForDay.weather[0].description}" 
          class="w-16 h-16 mx-auto"
        />
        <p>${forecastForDay.weather[0].description}</p>  <!-- Weather description for the day -->
        <p class="font-semibold">${forecastForDay.main.temp}°C</p>  <!-- Temperature for the day -->
        <p>Humidity: ${forecastForDay.main.humidity}%</p>  <!-- Humidity for the day -->
        <p>Wind Speed: ${forecastForDay.wind.speed} m/s</p>  <!-- Wind speed for the day -->
      </div>
    `;
  }).join('');  // Join all the days' forecasts into one string and display
}

// Event listener for the search button
searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();  // Get city name from input
  if (!city) {
    // Display an error message if city input is empty
    weatherDisplay.innerHTML = `<p class="text-red-500 text-center">Please enter a city name.</p>`;
    return;
  }
  if (!recentCities.includes(city)) {
    // Add the city to recent cities if it's not already included
    recentCities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));  // Save to localStorage
    updateSuggestions();  // Update suggestions dropdown
  }

  // Fetch both current weather and 5-day forecast for the city
  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
});

// Event listener for current location button
currentLocationButton.addEventListener("click", () => {
  // Use geolocation API to get user's current coordinates
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;
      // Fetch weather and forecast based on current location
      fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
      fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    },
    () => {
      // Handle error if unable to retrieve location
      weatherDisplay.innerHTML = `<p class="text-red-500 text-center">Unable to retrieve location.</p>`;
    }
  );
});

// Event listener for clicking on suggestions
suggestions.addEventListener("click", (e) => {
  if (e.target && e.target.nodeName === "DIV") {
    const city = e.target.textContent;  // Get the city name from the clicked suggestion
    cityInput.value = city;  // Set the city input field to the selected city
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  }
});

// Show suggestions when the input field is focused
cityInput.addEventListener("focus", updateSuggestions);

// Hide suggestions when the input field loses focus
cityInput.addEventListener("blur", () => {
  setTimeout(() => suggestions.classList.add("hidden"), 200);  // Delay hiding the suggestions to allow clicking
});

// Initialize the app with initial state
initializeApp();
