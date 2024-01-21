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
        setAllCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching all countries:', error);
      });
  }, []);

  useEffect(() => {
    // Filter countries based on the input value
    const filtered = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    ).map(country => country.name); // Map to the "name" property
    setFilteredCountries(filtered);
  }, [value, allCountries]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input value={value} onChange={handleChange} />
      <pre>
        {JSON.stringify(filteredCountries.map(country => country.common), null, 2)}
      </pre>
    </div>
  );
};

export default App;