import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [value, setValue] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weatherIcon, setWeatherIcon] = useState({});
  const [city, setCity] = useState([]);
  const [cityWeather, setCityWeather] = useState({main: {}, weather: [], wind: {}});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_API_KEY
// variable api_key now has the value set in startup

  // Fetch all countries
  useEffect(() => {
    // Fetch all countries when the component mounts
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log("SEE ALL DATA", response);
        setAllCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching all countries:', error);
      });
  }, []);

  useEffect(() => {
    // Check if there is any input
    if (value === '') {
      // If there's no input, display all countries
      const allCountriesMapped = allCountries.map(country => country.name.common); // Assuming structure { name: { common: 'Country Name' } }
      setFilteredCountries(allCountriesMapped);
    } else {
      // Filter countries based on the input value
      const filtered = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      );

      if (filtered.length === 1) {
        // Handle the case for exactly one match
        const country = filtered[0];
        setFilteredCountries([{
          name: country.name.common,
          capital: country.capital ? country.capital[0] : 'N/A',
          area: country.area,
          languages: country.languages ? Object.entries(country.languages).map(([code, name]) => name) : [],
          flag: country.flags.png ? country.flags.png : country.flags.svg,
        }]);
      } else if (filtered.length > 10) {
        setFilteredCountries(['too many matches, please be more specific']);
      } else {
        const mappedFiltered = filtered.map(country => country.name.common);
        setFilteredCountries(mappedFiltered);
      }
    }
  }, [value, allCountries]);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.capital}&units=metric&appid=${api_key}`)
      .then(response => {
        console.log("SEE WEATHER DATA", response.data);
        setCityWeather({
          main: response.data.main,
          weather: response.data.weather[0],
          wind: response.data.wind,
        });
      })
  }, [city]);


  // Fetch weather icon
  useEffect(() => {
    // Fetch all countries when the component mounts
    axios.get(`https://openweathermap.org/img/wn/${cityWeather.weather.icon}@2x.png`)
      .then(response => {
        console.log("WEATHER ICON", response);
        weatherIcon()
      })
      .catch(error => {
        console.error('Error fetching weather icon', error);
      });
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setValue(''); // Reset the input field to empty
    setSelectedCountry(null); // Deselect any selected country
    // Assuming you have a way to reset filtered countries, do it here
    // For example, if filteredCountries is a state:
    // setFilteredCountries([]);
  };

  console.log("CITY WEATHER", city);

  console.log("CITY WEATHER DATA", cityWeather);
  return (
    
    <div>
      <input value={value} onChange={handleChange} />
      <pre>
          {selectedCountry ? 
          (
              // This block will render the detailed view of the selected country
              <div>
                <h2>{selectedCountry.name}</h2>
                <p>Capital: {selectedCountry.capital}</p>
                <p>Area: {selectedCountry.area} km²</p>
                <p>Languages:</p>
                <ul>
                  {selectedCountry.languages.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
                <img src={selectedCountry.flag} alt={`Flag of ${selectedCountry.name}`} style={{ width: '100px', height: 'auto' }} />
                <div>
                  Temperature
                  <ul>Temp:  {cityWeather.main.temp} °C</ul>
                  <ul>Feels like: {cityWeather.main.feels_like} °C</ul>
                  <ul>Description: {cityWeather.weather.main}</ul> 
                  <ul>Wind: {cityWeather.wind.speed} m/s</ul>
                  <ul>Icon: <img src={`https://openweathermap.org/img/wn/${cityWeather.weather.icon}@2x.png`} alt="Weather icon" /></ul> // Display the image here
                </div>
                <button onClick={() => setSelectedCountry(null)}>Close</button>
              </div>
            )
          : filteredCountries.length === 1 && typeof filteredCountries[0] === 'object' ? 
          (
              <div>
                <h2>{filteredCountries[0].name}</h2>
                <p>Capital: {filteredCountries[0].capital}</p>
                <p>Area: {filteredCountries[0].area} km²</p>
                <p>Languages:</p>
                <ul>
                  {filteredCountries[0].languages.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
                <img src={filteredCountries[0].flag} alt={`Flag of ${filteredCountries[0].name}`} style={{ width: '100px', height: 'auto' }} />
                {/* Add the Close button here */}
                <button onClick={handleClose}>Close</button>
              </div>
            )
          : filteredCountries[0] === 'too many matches, please be more specific'
            ? filteredCountries[0]
            : <div>
                <ul>
                  {filteredCountries.map((country, index) => (
                    <li key={index}>
                      {/* Ensure this is the correct property path to display the country's name */}
                      {country} {/* This assumes 'country' objects have a 'name' property */}
                      
                      {/* Adjust the button onClick to reference 'country.name' */}
                      <button onClick={() => {
                        const countryDetail = allCountries.find(countryItem => countryItem.name.common === country);
                        if (countryDetail) {
                          setSelectedCountry({
                            name: countryDetail.name.common,
                            capital: countryDetail.capital ? countryDetail.capital[0] : 'N/A',
                            area: countryDetail.area,
                            languages: countryDetail.languages ? Object.entries(countryDetail.languages).map(([code, name]) => name) : [],
                            flag: countryDetail.flags.png ? countryDetail.flags.png : countryDetail.flags.svg,
                          })
                          setCity({
                            capital: countryDetail.capital[0],
                          })
                        }
                      }}>Show</button>
                    </li>
                  ))
                  }
                </ul>
              </div>
        }
      </pre>
    </div>
  );
};

export default App;