import React from 'react';
import '../styles/LocationDropdown.css';

const counties = [
  'Agder', 
  'Akershus', 
  'Buskerud', 
  'Finnmark', 
  'Innlandet', 
  'Møre og Romsdal', 
  'Nordland', 
  'Oslo', 
  'Rogaland', 
  'Telemark', 
  'Troms', 
  'Trøndelag', 
  'Vestfold', 
  'Vestland', 
  'Østfold'
];

const LocationDropdown = ({ profileData, setProfileData, setErrorMessage, setIsInputValid }) => {
  const handleLocationChange = (e) => {
    setProfileData({ ...profileData, location: e.target.value });
    setErrorMessage(''); // Clear error when a valid selection is made
    setIsInputValid(true); 
  };

  return (
    <div className='profileSetupLocation-dropdown'>
      <h2>Velg ditt fylke</h2>
      <select
        name="location"
        value={profileData.location || ''}
        onChange={handleLocationChange}
        className="profileSetupLocation-inputtext"
      >
        <option value="">Velg fylke</option>
        {counties.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationDropdown;