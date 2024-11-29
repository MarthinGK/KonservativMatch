import React, { useState, useEffect } from 'react';
import { fetchUserProfileByUserId, saveUserProfileByUserId } from '../../api/UserAPI';
import '../../styles/EditProfileAboutYou.css';

const EditProfileAboutYou = ({ userId }) => {
  const [fields, setFields] = useState(null);
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [heightTempValue, setHeightTempValue] = useState(null); // Track temp height value

  // Fetch user profile on load
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfileByUserId(userId);
        setFields({
          height: data.height || 170, // Default height if not set
          smoking: data.smoking || '',
          alcohol: data.alcohol || '',
          religion: data.religion || '',
          location: data.location || '',
        });
        setHeightTempValue(data.height || 170); // Initialize temp height
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    loadUserProfile();
  }, [userId]);

  const handleFieldUpdate = async (field, value) => {
    try {
      const updatedFields = { [field]: value };

      console.log('FIELD: ', field);
      console.log('UPDATED FIELDS: ', updatedFields);

      await saveUserProfileByUserId(userId, updatedFields);
      setFields((prevFields) => ({ ...prevFields, [field]: value }));
      setEditField(null);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleHeightSave = async () => {
    try {
      await saveUserProfileByUserId(userId, { height: heightTempValue });
      setFields((prevFields) => ({ ...prevFields, height: heightTempValue }));
      setEditField(null);
    } catch (error) {
      console.error('Error saving height:', error);
    }
  };

  if (!fields) {
    return <div>Loading...</div>;
  }

  return (
    <div className="about-you-container">
      {Object.entries(fields).map(([field, value]) => (
        <div key={field} className="about-you-field">
          <div className="field-display">
            <span className="field-name">{field}:</span>
            {editField === field ? (
              <div className="field-edit">
                {field === 'height' ? (
                  <div className="height-adjuster">
                    <input
                      type="range"
                      min="120"
                      max="220"
                      step="1"
                      value={heightTempValue}
                      onChange={(e) => setHeightTempValue(e.target.value)}
                      className="field-slider"
                    />
                    <span className="height-display">{heightTempValue} cm</span>
                    <button
                      className="save-button"
                      onClick={handleHeightSave}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="button-group">
                    {getOptionsForField(field).map((option) => (
                      <button
                        key={option}
                        className={`profileSetupSelectButton ${
                          value === option ? 'selected' : ''
                        }`}
                        onClick={() => handleFieldUpdate(field, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span
                className="field-value"
                onClick={() => setEditField(field)}
              >
                {value}
              </span>
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
    case 'smoking':
      return ['Aldri', 'Sjeldent', 'Sosialt', 'Ofte', 'Hver dag'];
    case 'alcohol':
      return ['Aldri', 'Sjeldent', 'Sosialt', 'Ofte', 'Hver dag'];
    case 'religion':
      return ['Kristen', 'Ateist', 'Agnostisk', 'Muslim', 'Hindu', 'Annet'];
    default:
      return [];
  }
};

export default EditProfileAboutYou;
