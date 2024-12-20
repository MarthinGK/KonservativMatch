import React, { useState, useEffect } from 'react';
import {
  uploadProfilePhoto,
  fetchProfilePhotos,
  deleteProfilePhoto,
  updatePhotoOrder,
} from '../../api/PhotosAPI';
import '../../styles/editprofile/EditProfilePhotosGrid.css';
import '../../styles/editprofile/EditProfileHeader.css';

const EditProfilePhotosGrid = ({ userId }) => {
  const [photosData, setPhotosData] = useState({
    userId: userId,
    photoUrls: Array(8).fill(null), // Initialize 8 slots
  });
  const [errorMessages, setErrorMessages] = useState(Array(8).fill('')); // Error messages for each slot

  // Fetch user photos when the component loads
  useEffect(() => {
    const fetchUserPhotos = async () => {
      try {
        const fetchedPhotos = await fetchProfilePhotos(userId);
        console.log('Fetched photos:', fetchedPhotos);

        // Sort photos based on their position in the database
        const sortedPhotos = Array(8).fill(null);
        fetchedPhotos.forEach((photo) => {
          if (photo.position < 8) {
            sortedPhotos[photo.position] = photo.photo_url;
          }
        });

        setPhotosData((prevState) => ({
          ...prevState,
          photoUrls: sortedPhotos,
        }));
      } catch (error) {
        console.error('Error fetching user photos:', error);
      }
    };

    fetchUserPhotos();
  }, [userId]);

  // Handle photo uploads
  const handlePhotosUpload = async (index, event) => {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!file || !validImageTypes.includes(file.type)) {
      const newErrorMessages = [...errorMessages];
      newErrorMessages[index] =
        'Invalid file type. Please upload valid images (JPEG, PNG).';
      setErrorMessages(newErrorMessages);
      return;
    }

    // Clear the error message for valid files
    const newErrorMessages = [...errorMessages];
    newErrorMessages[index] = '';
    setErrorMessages(newErrorMessages);

    try {
      const response = await uploadProfilePhoto(userId, file, index); // Include the position (index)
      const uploadedPhotoUrl = response.photo_url;

      const newPhotoUrls = [...photosData.photoUrls];
      newPhotoUrls[index] = uploadedPhotoUrl;

      setPhotosData({ ...photosData, photoUrls: newPhotoUrls });
    } catch (error) {
      console.error('Error uploading photo:', error);
      const newErrorMessages = [...errorMessages];
      newErrorMessages[index] = 'Error uploading photo. Please try again.';
      setErrorMessages(newErrorMessages);
    }
  };

  // Handle photo removal
  const handlePhotoRemove = async (index) => {
    const photoToDelete = photosData.photoUrls[index];
    try {
      await deleteProfilePhoto(userId, photoToDelete);

      const updatedPhotoUrls = [...photosData.photoUrls];
      updatedPhotoUrls[index] = null;

      setPhotosData({ ...photosData, photoUrls: updatedPhotoUrls });
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  // Handle drag-and-drop
  const handleDragStart = (index) => (event) => {
    console.log('Dragging index:', index);
    event.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = async (event, index) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    console.log('Dragged index:', draggedIndex);
    console.log('Drop index:', index);

    if (isNaN(draggedIndex) || draggedIndex === index) {
      console.error('Invalid drag or drop operation.');
      return;
    }

    const newPhotoUrls = [...photosData.photoUrls];

    // Swap the dragged photo with the target position
    [newPhotoUrls[draggedIndex], newPhotoUrls[index]] = [
      newPhotoUrls[index],
      newPhotoUrls[draggedIndex],
    ];

    console.log('New photoUrls after swapping:', newPhotoUrls);

    // Update state
    setPhotosData({ ...photosData, photoUrls: newPhotoUrls });

    // Update positions in the backend
    try {
      console.log('Sending updated order to backend...');
      await updatePhotoOrder(userId, newPhotoUrls);
      console.log('Photo order updated successfully.');
    } catch (error) {
      console.error('Failed to update photo order on the backend:', error);
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="header-container-grid">
        <h3>Bilder</h3>
        <div className="tip-container">
          <i className="fas fa-lightbulb"></i>
          <p>Profiler med flere bilder gjør det best</p>
        </div>
      </div>
      <div className="image-grid-editpage">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="image-slot"
              draggable={!!photosData.photoUrls[index]} // Make draggable only if a photo exists
              onDragStart={handleDragStart(index)}
              onDrop={(event) => handleDrop(event, index)} // Updated to pass event and index
              onDragOver={allowDrop}
            >
              {photosData.photoUrls[index] ? (
                <div className="image-wrapper">
                  <img
                    src={`${photosData.photoUrls[index]}`}
                    alt=""
                    className="uploaded-image"
                  />
                  <button
                    className="remove-photo-button"
                    onClick={() => handlePhotoRemove(index)}
                  >
                    X
                  </button>
                </div>
              ) : (
                <div>
                  <label className="image-placeholder">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotosUpload(index, e)}
                      className="image-input"
                    />
                    +
                  </label>
                  {errorMessages[index] && (
                    <p style={{ color: 'red' }}>{errorMessages[index]}</p>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default EditProfilePhotosGrid;
