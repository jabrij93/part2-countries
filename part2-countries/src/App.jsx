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

    // Check the number of filtered countries
    if (filtered.length > 10) {
      // When there are more than 10 matches, display a specific message
      setFilteredCountries(['too many matches, please be more specific']);
    } else {
      // When there are 10 or fewer matches, or no input, map to the "name" property correctly
      const mappedFiltered = filtered.map(country => country.name.common); // Adjust based on actual data structure
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
        {filteredCountries.length === 1 && filteredCountries[0] === 'too many matches, please be more specific'
          ? filteredCountries[0] : JSON.stringify(filteredCountries, null, 2)}
      </pre>
    </div>
  );
};

export default App;