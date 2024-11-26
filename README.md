
# Weather App

A simple weather application built using HTML, Tailwind CSS, and JavaScript. It fetches current weather and 5-day forecast data from the OpenWeatherMap API and displays it in a user-friendly interface.

## Features

- **Search for city weather**: Allows users to search for weather by entering a city name.
- **Current location weather**: Fetches weather data based on the user's current location.
- **Recent city suggestions**: Displays recently searched cities for quick access.
- **5-day weather forecast**: Shows a 5-day weather forecast with weather conditions and temperature.
- **Responsive design**: The app is fully responsive, and it adapts to different screen sizes.

## Prerequisites

To run this project, you need the following:

- A modern web browser (e.g., Chrome, Firefox, Safari)
- A text editor or IDE to view and edit the source code (e.g., VS Code, Sublime Text)
- Internet connection for fetching weather data

## Setup Instructions

### 1. Clone the repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/weather-app.git
```

### 2. Install dependencies (if necessary)

Since this project doesn't have any specific server-side dependencies and only uses a static HTML file, there's no need for installation steps.

However, if you plan to add more features and need to use NPM packages or bundlers like Webpack, you can run:

```bash
npm install
```

### 3. Create an OpenWeatherMap API key

To fetch weather data, you need to sign up for an API key from OpenWeatherMap:

1. Go to [OpenWeatherMap](https://openweathermap.org/).
2. Create an account and log in.
3. Navigate to the **API** section and generate a new **API key**.

### 4. Update the API key

Open the `script.js` file in your project folder, and replace the placeholder API key with your own key:

```javascript
const API_KEY = "your-openweathermap-api-key";
```

### 5. Open the project

After setting up the API key, open the `index.html` file in a browser to start using the Weather App.

You can double-click the `index.html` file or serve it via any web server of your choice.

## Usage

1. **Search for Weather**:
   - Enter a city name in the search input field and click the "Search" button to fetch the weather data for that city.
   - Recent cities you've searched for will be shown in a dropdown under the search bar. You can select any recent city to quickly view its weather data.

2. **Current Location Weather**:
   - Click the "Current Location" button to automatically fetch weather data based on your current location (requires geolocation permissions).

3. **View 5-day Forecast**:
   - Once a city is selected, the app will display the 5-day weather forecast, showing details like temperature, weather condition, humidity, and wind speed for each day.

## Contributing

If you'd like to contribute to the development of this project, feel free to fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenWeatherMap API](https://openweathermap.org/) for providing weather data.
- [Tailwind CSS](https://tailwindcss.com/) for styling the application.
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) for fetching the user's current location.

---
