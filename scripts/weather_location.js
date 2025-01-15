// Ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '247507483c5e4fec028888797697555a'; // Replace with your actual API key
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric';

    const searchBox = document.querySelector('.input');
    const searchBtn = document.querySelector('.button');
    const weatherIcon = document.querySelector('.weather-icon');

    // Function to fetch and display weather data
    // Function to fetch and display weather data
    async function checkWeather(query) {
        try {
            const response = await fetch(`${apiUrl}&${query}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            console.log(data);

            // Update UI with weather details
            document.querySelector('.city').textContent = data.name;
            document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
            document.querySelector('.humidity').textContent = `${data.main.humidity}%`;
            document.querySelector('.wind').textContent = `${data.wind.speed} km/h`;

            // Update weather icon dynamically
            const weatherCondition = data.weather[0].main.toLowerCase();
            const iconMap = {
                clouds: 'images/cloud.png',
                clear: 'images/clear.png',
                rain: 'images/rain.png',
                drizzle: 'images/drizzle.png',
                mist: 'images/snow.png',
                snow: 'images/mist.png',
                haze: 'images/haze.png',
            };
            // Background color map based on weather conditions
            const backgroundGradientMap = {
                clouds: 'linear-gradient(135deg, #b0bec5, #546e7a)', // Gray tones for cloudy weather
                clear: 'linear-gradient(135deg, #ffeb3b, #ff9800)', // Sunny yellow to orange
                rain: 'linear-gradient(135deg, #4caf50, #00796b)', // Greenish tones for rain
                drizzle: 'linear-gradient(135deg, #81d4fa, #0288d1)', // Light blue for drizzle
                mist: 'linear-gradient(135deg, #cfd8dc, #90a4ae)', // Light grayish blue for mist
                snow: 'linear-gradient(135deg, #ffffff, #e0e0e0)', // White for snow
                default: 'linear-gradient(135deg, #00feba, #5b548a)', // Default gradient
                haze: 'linear-gradient(135deg, #4caf50, #00796b)',
            };
            // Change background color dynamically
            const backgroundColor = backgroundGradientMap[weatherCondition] || backgroundGradientMap.default;
            document.querySelector('.js-card').style.background = backgroundColor
            document.querySelector('.js-card').style.transition = 'background-color 1s ease-in-out';


            // Set weather icon or fallback
            weatherIcon.src = iconMap[weatherCondition] || 'images/clear.png';

            // Display the weather section and hide error message
            document.querySelector('.weather').style.display = 'block';
            document.querySelector('.error').style.display = 'none';
        } catch (error) {
            console.error(error);
            document.querySelector('.error').style.display = 'block';
            document.querySelector('.weather').style.display = 'none';
        }
    }

    // Function to get the user's current location
    function getCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const query = `lat=${latitude}&lon=${longitude}`;
                    checkWeather(query);
                },
                (error) => {
                    console.error(`Geolocation error (${error.code}): ${error.message}`);
                    // Fallback to a default city if location access is denied
                    checkWeather('q=Lagos');
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Fallback to a default city if geolocation is not supported
            checkWeather('q=Lagos');
        }
    }

    // Event listeners for search functionality
    searchBtn.addEventListener('click', () => {
        const city = searchBox.value.trim();
        if (city) {
            checkWeather(`q=${city}`);
        }
    });

    searchBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const city = searchBox.value.trim();
            if (city) {
                checkWeather(`q=${city}`);
            }
        }
    });

    // Get the current location when the page loads
    getCurrentLocation();
});