import React, { useState, useEffect, useRef } from 'react';
import {
  fetchUserProfileByUserId,
  saveUserProfileByUserId,
  fetchProfileActiveStatus,
  updateProfileActiveStatus,
} from '../api/UserAPI';
import { updateUserEmail } from '../api/AuthAPI';
import '../styles/editaccount/EditAccountPage.css';
import { useAuth0 } from '@auth0/auth0-react';

const EditAccountPage = () => {
  const { user } = useAuth0();
  const userId = user.sub;
  const isDatabaseUser = user.sub.startsWith('auth0|'); // Check if the user is a database user
  const [fields, setFields] = useState(null);
  const [profileActive, setProfileActive] = useState(true); // Track profile active status
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [tempValues, setTempValues] = useState({}); // Temporary values for editable fields
  const [emailTempValue, setEmailTempValue] = useState('');
  const [dobTemp, setDobTemp] = useState({ day: '', month: '', year: '' }); // Temp date of birth
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation modal visibility
  const containerRef = useRef(null); // Reference to the container

  // Fetch user account data and profile active status on load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [userData, activeStatus] = await Promise.all([
          fetchUserProfileByUserId(userId),
          fetchProfileActiveStatus(userId),
        ]);

        setFields({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          epost: userData.email || '',
          fødselsdato: userData.date_of_birth || '',
        });

        setTempValues({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
        });

        if (userData.date_of_birth) {
          const [year, month, day] = userData.date_of_birth.split('-');
          setDobTemp({ day, month, year });
        }

        setProfileActive(activeStatus !== false); // Default to true if not explicitly false
        setEmailTempValue(userData.email || '');
      } catch (error) {
        console.error('Error fetching user account info or profile active status:', error);
      }
    };
    loadUserData();
  }, [userId]);

  const handleSaveField = async (field) => {
    try {
      const fieldToUpdate = field === 'fødselsdato' ? 'date_of_birth' : field;
      const value = tempValues[field];

      await saveUserProfileByUserId(userId, { [fieldToUpdate]: value });

      setFields((prevFields) => ({ ...prevFields, [field]: value }));
      setEditField(null);
    } catch (error) {
      console.error('Error saving user account info:', error);
    }
  };

  const handleChangeTempValue = (field, value) => {
    setTempValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleDateSave = async () => {
    const formattedDate = `${dobTemp.year}-${dobTemp.month}-${dobTemp.day}`;
    try {
      await saveUserProfileByUserId(userId, { date_of_birth: formattedDate });
      setFields((prevFields) => ({ ...prevFields, fødselsdato: formattedDate }));
      setEditField(null);
    } catch (error) {
      console.error('Error saving date of birth:', error);
    }
  };

  const handleProfileActiveUpdate = async (value) => {
    if (!value) {
      setShowConfirmation(true); // Show confirmation modal
      return;
    }

    try {
      await updateProfileActiveStatus(userId, value);
      setProfileActive(value);
    } catch (error) {
      console.error('Error updating profile active status:', error);
    }
  };

  const confirmDisableProfile = async () => {
    try {
      await updateProfileActiveStatus(userId, false);
      setProfileActive(false);
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error('Error disabling profile:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setEditField(null); // Close any open fields
    }
  };

  const handleFieldUpdate = async (field, value) => {
    try {
      const fieldToUpdate = field === 'fødselsdato' ? 'date_of_birth' : field;

      if (field === 'epost' && isDatabaseUser) {
        await updateUserEmail(userId, value);
        setEmailTempValue(value);
      } else {
        await saveUserProfileByUserId(userId, { [fieldToUpdate]: value });
      }

      setFields((prevFields) => ({ ...prevFields, [field]: value }));
      setEditField(null);
    } catch (error) {
      console.error('Error saving user account info:', error);
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
    <div className="account-info-container" ref={containerRef}>
      <div className="header-container-account">
        <h3>Brukerinfo</h3>
      </div>
      {Object.entries(fields).map(([field, value]) => (
        <div
          key={field}
          className="account-info-field"
          onClick={() => setEditField(field)}
        >
          <div className="field-display">
            <span className="field-name">
              {field === 'first_name'
                ? 'Fornavn'
                : field === 'last_name'
                ? 'Etternavn'
                : field === 'epost'
                ? 'E-post'
                : field === 'fødselsdato'
                ? 'Fødselsdato'
                : field}
              :
            </span>
            {editField === field ? (
              <div className="field-edit">

                {field === 'epost' ? (
                  isDatabaseUser ? (
                    <div>
                      <input
                        type="email"
                        value={emailTempValue}
                        onChange={(e) => setEmailTempValue(e.target.value)}
                        className="input-field"
                      />
                      <button
                        className="save-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFieldUpdate(field, emailTempValue);
                        }}
                      >
                        Lagre
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="info-text">
                        Du kan ikke endre e-posten fordi kontoen din ble opprettet gjennom en tredjepartsleverandør (f.eks. Google).
                      </p>
                    </div>
                  )
                ) : field === 'fødselsdato' ? (
                  <div className="dob-spacing">
                    <select
                      value={dobTemp.day}
                      onChange={(e) => setDobTemp({ ...dobTemp, day: e.target.value })}
                      className="dob-dropdown"
                    >
                      <option value="">Dag</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      value={dobTemp.month}
                      onChange={(e) => setDobTemp({ ...dobTemp, month: e.target.value })}
                      className="dob-dropdown"
                    >
                      <option value="">Måned</option>
                      {[
                        'Januar',
                        'Februar',
                        'Mars',
                        'April',
                        'Mai',
                        'Juni',
                        'Juli',
                        'August',
                        'September',
                        'Oktober',
                        'November',
                        'Desember',
                      ].map((month, index) => (
                        <option key={index + 1} value={String(index + 1).padStart(2, '0')}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={dobTemp.year}
                      onChange={(e) => setDobTemp({ ...dobTemp, year: e.target.value })}
                      className="dob-dropdown"
                    >
                      <option value="">År</option>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      className="save-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateSave();
                      }}
                    >
                      Lagre
                    </button>
                  </div>
                ) : (
                  <div className='name-input-field'>
                    <input
                      type="text"
                      value={tempValues[field] || ''}
                      onChange={(e) => handleChangeTempValue(field, e.target.value)}
                      className="input-field"
                    />
                    <button
                      className="save-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveField(field);
                      }}
                    >
                      Lagre
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span className="field-value">
                {field === 'fødselsdato' && value ? value.split('-').reverse().join('/') : value || 'Set value'}
              </span>
            )}
          </div>
        </div>
      ))}
      <div className="account-info-field">
        <div className="field-display">
          <span className="field-name">Bruker aktiv:</span>
          <select
            value={profileActive ? 'yes' : 'no'}
            onChange={(e) => handleProfileActiveUpdate(e.target.value === 'yes')}
            className="input-field"
          >
            <option value="yes">Ja</option>
            <option value="no">Nei</option>
          </select>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>
              Dette vil deaktivere profilen din. Medlemmer vil ikke kunne se deg, og du vil ikke kunne se andre
              medlemmer. Fortsette?
            </p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmDisableProfile}>
                Ja
              </button>
              <button className="cancel-button" onClick={() => setShowConfirmation(false)}>
                Nei
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAccountPage;
