const API_KEY = '772d69061e688f7da2870b71a24eef14';
const API_URL = 'http://api.openweathermap.org/data/2.5/weather?';

export const getWeatherData = async (city, country) => {
    const url = API_URL + `q=${city},${country}&appid=${API_KEY}`
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data from API');
    }
    const data = await response.json();
    return data;
};