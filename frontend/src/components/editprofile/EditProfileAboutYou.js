import React, { useState, useEffect, useRef } from 'react';
import { fetchUserProfileByUserId, saveUserProfileByUserId } from '../../api/UserAPI';
import '../../styles/editprofile/EditProfileAboutYou.css';

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
  'Østfold',
];

const EditProfileAboutYou = ({ userId }) => {
  const [fields, setFields] = useState(null);
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [høydeTempValue, setHøydeTempValue] = useState(null); // Track temp høyde value
  const [customReligion, setCustomReligion] = useState(''); // Track custom religion input
  const containerRef = useRef(null); // Reference to the container

  // Fetch user profile on load
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfileByUserId(userId);
        setFields({
          høyde: data.height || 170,
          røyker: data.smoking || '',
          alkohol: data.alcohol || '',
          livssyn: data.religion || '',
          lokasjon: data.location || '',
        });
        setHøydeTempValue(data.height || 170);
        if (data.religion === 'Annet' && data.custom_religion) {
          setCustomReligion(data.custom_religion); // Load existing custom religion
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    loadUserProfile();
  }, [userId]);

  const handleFieldUpdate = async (field, value) => {
    try {
      const fieldToUpdate =
        field === 'høyde'
          ? 'height'
          : field === 'lokasjon'
          ? 'location'
          : field === 'røyker'
          ? 'smoking'
          : field === 'alkohol'
          ? 'alcohol'
          : field === 'livssyn'
          ? 'religion'
          : field;

      if (field === 'livssyn') {
        if (value !== 'Annet') {
          setCustomReligion(''); // Clear custom religion if not 'Annet'
        }
        // Save religion and custom religion to the backend
        await saveUserProfileByUserId(userId, {
          religion: value,
          custom_religion: value === 'Annet' ? customReligion : null,
        });
      } else {
        await saveUserProfileByUserId(userId, { [fieldToUpdate]: value });
      }

      // Update the local state
      setFields((prevFields) => ({
        ...prevFields,
        [field]: value,
      }));

      // Close the editing field
      if (value !== 'Annet') {
        setEditField(null);
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleCustomReligionSave = async () => {
    try {
      await saveUserProfileByUserId(userId, {
        religion: customReligion
      });
      setFields((prevFields) => ({
        ...prevFields,
        livssyn: customReligion,
      }));
      setEditField(null); // Close the field
    } catch (error) {
      console.error('Error saving custom religion:', error);
    }
  };

  const handleHøydeSave = async () => {
    try {
      await saveUserProfileByUserId(userId, { height: høydeTempValue });
      setFields((prevFields) => ({ ...prevFields, høyde: høydeTempValue }));
      setEditField(null);
    } catch (error) {
      console.error('Error saving høyde:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setEditField(null); // Close any open fields
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!fields) {
    return <div>Loading...</div>;
  }

  return (
    <div className="about-you-container" ref={containerRef}>
      <div className="header-container-about">
        <h3>Mer om deg</h3>
      </div>
      {Object.entries(fields).map(([field, value]) => (
        <div
          key={field}
          className="about-you-field"
          onClick={() => setEditField(field)} // Allow clicking anywhere
        >
          <div className="field-display">
            <span className="field-name">
              {field === 'høyde'
                ? 'Høyde'
                : field === 'lokasjon'
                ? 'Lokasjon'
                : field}
              :
            </span>
            {editField === field ? (
              <div className="field-edit">
                {field === 'høyde' ? (
                  <div className="height-adjuster">
                    <input
                      type="range"
                      min="120"
                      max="220"
                      step="1"
                      value={høydeTempValue}
                      onChange={(e) => setHøydeTempValue(e.target.value)}
                      className="field-slider"
                    />
                    <span className="height-display">{høydeTempValue} cm</span>
                    <button
                      className="save-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHøydeSave();
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : field === 'lokasjon' ? (
                  <div className="field-dropdown">
                    <select
                      name="lokasjon"
                      value={fields.lokasjon || ''}
                      onChange={(e) => handleFieldUpdate('lokasjon', e.target.value)}
                      className="inputtext"
                    >
                      <option value="">Velg fylke</option>
                      {counties.map((county) => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : field === 'livssyn' ? (
                  <div className="button-group">
                    {getOptionsForField(field).map((option) => (
                      <button
                        key={option}
                        className={`profileSetupSelectButton ${
                          value === option ? 'selected' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldUpdate('livssyn', option);
                          if (option === 'Annet') {
                            setEditField('livssyn');
                          }
                        }}
                      >
                        {option}
                      </button>
                    ))}
                    {value === 'Annet' && (
                      <div className="custom-religion">
                        <input
                          type="text"
                          maxLength="50"
                          placeholder="Spesifiser"
                          value={customReligion}
                          onChange={(e) => setCustomReligion(e.target.value)}
                          className="custom-religion-input"
                        />
                        <button
                          className="save-button-religion"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomReligionSave();
                          }}
                        >
                          Lagre
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="button-group">
                    {getOptionsForField(field).map((option) => (
                      <button
                        key={option}
                        className={`profileSetupSelectButton ${
                          value === option ? 'selected' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldUpdate(field, option);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="field-value">{value || 'Set value'}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper to get options for each field
const getOptionsForField = (field) => {
  switch (field) {
    case 'røyker':
      return ['Aldri', 'Sjeldent', 'Sosialt', 'Ofte', 'Hver dag'];
    case 'alkohol':
      return ['Aldri', 'Sjeldent', 'Sosialt', 'Ofte', 'Hver dag'];
    case 'livssyn':
      return ['Kristen', 'Ateist', 'Agnostisk', 'Muslim', 'Hindu', 'Annet'];
    default:
      return [];
  }
};

export default EditProfileAboutYou;