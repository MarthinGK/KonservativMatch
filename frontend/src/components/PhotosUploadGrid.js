import React, { useState, useEffect } from 'react';
import '../styles/PhotosUploadGrid.css'; // Assuming there's a CSS file for the grid styling
import { uploadProfilePhoto, fetchProfilePhotos, deleteProfilePhoto } from '../api/PhotosAPI'; // Adjust API import as needed

const PhotosUploadGrid = ({ userId }) => {
  const [photos, setPhotos] = useState(Array(6).fill(null)); // Grid with 6 slots
  const [errorMessages, setErrorMessages] = useState(Array(6).fill(''));

  useEffect(() => {
    // Fetch previously uploaded photos when component loads
    const loadPhotos = async () => {
      try {
        const fetchedPhotos = await fetchProfilePhotos(userId);
        const newPhotos = [...photos];
        fetchedPhotos.forEach((photoUrl, index) => {
          if (index < 6) {
            newPhotos[index] = photoUrl;
          }
        });
        setPhotos(newPhotos);
      } catch (error) {
        console.error('Error fetching profile photos:', error);
      }
    };

    loadPhotos();
  }, [userId]);

  const handlePhotoUpload = async (index, event) => {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Validate file type
    if (!file || !validImageTypes.includes(file.type)) {
      const newErrorMessages = [...errorMessages];
      newErrorMessages[index] = 'Invalid file type. Please upload valid images (JPEG, PNG).';
      setErrorMessages(newErrorMessages);
      return;
    }

    // Clear the error message if the file is valid
    const newErrorMessages = [...errorMessages];
    newErrorMessages[index] = '';
    setErrorMessages(newErrorMessages);

    // Upload the file to the server immediately
    try {
      const response = await uploadProfilePhoto(userId, file);
      const uploadedPhotoUrl = response.photos[0]; // Assuming backend returns an array of uploaded photos

      // Update photos state with the new photo URL
      const newPhotos = [...photos];
      newPhotos[index] = uploadedPhotoUrl;
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Error uploading photo:', error);
      const newErrorMessages = [...errorMessages];
      newErrorMessages[index] = 'Error uploading photo. Please try again.';
      setErrorMessages(newErrorMessages);
    }
  };

  const handleRemovePhoto = async (index) => {
    if (photos[index]) {
      try {
        await deleteProfilePhoto(userId, photos[index]); // Call API to delete photo
        const newPhotos = [...photos];
        newPhotos[index] = null; // Clear the photo from the grid 
        setPhotos(newPhotos);
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  return (
    <div className="photos-upload-grid">
      {photos.map((photo, index) => (
        <div key={index} className="photo-slot">
          {photo ? (
            <div className="photo-container">
              <img src={`http://localhost:5000${photo}`} alt="Uploaded" className="uploaded-photo" />
              <button className="remove-photo-button" onClick={() => handleRemovePhoto(index)}>
                &times;
              </button>
            </div>
          ) : (
            <div className="photo-placeholder">
              <label htmlFor={`photo-upload-${index}`} className="photo-upload-label">
                +
              </label>
              <input
                type="file"
                id={`photo-upload-${index}`}
                accept="image/*"
                className="photo-upload-input"
                onChange={(event) => handlePhotoUpload(index, event)}
              />
            </div>
          )}
          {errorMessages[index] && <p className="error-message">{errorMessages[index]}</p>}
        </div>
      ))}
    </div>
  );
};

export default PhotosUploadGrid;