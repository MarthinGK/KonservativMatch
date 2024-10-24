import React, { useState, useEffect } from 'react';
import '../styles/LocationDropdown.css'; // Import custom CSS

const LocationDropdown = ({ onSelectLocation }) => {
  const [counties, setCounties] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');

  // List of Norwegian counties (or any specific locations you want to include)
  const norwegianCounties = [
    'Oslo', 'Viken', 'Vestfold og Telemark', 'Agder', 'Rogaland', 
    'Vestland', 'Møre og Romsdal', 'Trøndelag', 'Nordland', 'Troms og Finnmark'
  ];

  // Simulating a fetch from an API or external source to get the counties (you can replace this with real API call)
  useEffect(() => {
    setCounties(norwegianCounties);
  }, []);

  // Handle when a location is selected from the dropdown
  const handleLocationChange = (e) => {
    const selected = e.target.value;
    setSelectedCounty(selected);
    onSelectLocation(selected); // Send the selected location back to the parent component
  };

  return (
    <div className="location-dropdown">
      <label htmlFor="county">Velg Fylke (Choose County):</label>
      <select id="county" value={selectedCounty} onChange={handleLocationChange}>
        <option value="">Velg Fylke</option>
        {counties.map((county, index) => (
          <option key={index} value={county}>
            {county}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationDropdown;
