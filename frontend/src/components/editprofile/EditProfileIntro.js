import React, { useState, useEffect } from 'react';
import { fetchUserIntroduction, saveUserIntroduction } from '../../api/UserAPI';
import '../../styles/EditProfileIntro.css'; // Custom styles for the intro box

const EditProfileIntro = ({userId}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [intro, setIntro] = useState('Loading...');

  useEffect(() => {
    const loadIntroduction = async () => {
      try {
        const fetchedIntro = await fetchUserIntroduction(userId);
        setIntro(fetchedIntro || "Click here to add an introduction");
      } catch (error) {
        console.error('Error loading introduction:', error);
        setIntro('Error loading introduction.');
      }
    };

    loadIntroduction();
  }, [userId]);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await saveUserIntroduction(userId, intro);
      console.log('Introduction saved successfully');
    } catch (error) {
      console.error('Error saving introduction:', error);
    }
  };

  return (
    <div className="edit-profile-main-container">
      <div className="header-container-intro">
        <h3>Litt om meg</h3>
      </div>
      {isEditing ? (
        <div className="intro-edit-container">
          <textarea
            className="intro-textarea"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Write something about yourself..."
          />
          <button className="save-intro-button" onClick={handleSave}>
            Lagre
          </button>
        </div>
      ) : (
        <div className="intro-display-container" onClick={() => setIsEditing(true)}>
          <p className={`intro-text ${intro === "Click here to add an introduction" ? 'placeholder' : ''}`}>
            {intro}
          </p>
        </div>
      )}
    </div>
  );
};

export default EditProfileIntro;
