import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [value, setValue] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    // Fetch all countries when the component mounts
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log("SEE ALL DATA", response);
        console.log("SEE ALL DATA NAME COMMON", response.data.map(item => item.name.common));
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
          flag: country.flags.png,
        }]);
      } else if (filtered.length > 10) {
        setFilteredCountries(['too many matches, please be more specific']);
      } else {
        const mappedFiltered = filtered.map(country => country.name.common);
        setFilteredCountries(mappedFiltered);
      }
    }
  }, [value, allCountries]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input value={value} onChange={handleChange} />
      <pre>
        {filteredCountries.length === 1 && typeof filteredCountries[0] === 'object'
          ? (
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
              </div>
            )
          : filteredCountries[0] === 'too many matches, please be more specific'
            ? filteredCountries[0]
            : JSON.stringify(filteredCountries, null, 2)
        }
      </pre>
      {/* <pre>
        {filteredCountries.length === 1 && typeof filteredCountries[0] === 'too many matches, please be more specific'
          ? (
              <div>
                <h2>{filteredCountries[0].name}</h2>
                <p>Capital: {filteredCountries[0].capital}</p>
                <p>Area: {filteredCountries[0].area} km²</p>
                <p>Languages: {filteredCountries[0].languages}</p>
                <img src={filteredCountries[0].flag} alt={`Flag of ${filteredCountries[0].name}`} />
              </div>
            )
          : JSON.stringify(filteredCountries, null, 2)
        }
      </pre> */}
    </div>
  );
};

export default App;