import React, { useEffect, useState } from 'react';
import { uploadProfilePhoto, fetchProfilePhotos, deleteProfilePhoto } from '../api/PhotosAPI';  // Import API functions
import '../styles/SetupPhotosGrid.css'; 

const PhotosUploadGrid = ({ photosData, setPhotosData }) => {
  const [errorMessages, setErrorMessages] = useState(Array(6).fill('')); // Initialize an array for error messages

  //   // Fetch previously uploaded photos when the component loads
  const [photos, setPhotos] = useState(Array(6).fill(null)); // Grid with 6 slots

  useEffect(() => {
    const fetchUserPhotos = async () => {
      try {
        const fetchedPhotos = await fetchProfilePhotos(photosData.userId);
        setPhotosData((prevState) => ({ 
          ...prevState, 
          photoUrls: fetchedPhotos // Store URLs in the state
        }));
      } catch (error) {
        console.error('Error fetching user photos:', error);
      }
    };

    fetchUserPhotos();
  }, [photosData.userId, setPhotosData]);

  // Handle photo upload
  const handlePhotosUpload = async (index, event) => {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Validate file type and show error for specific grid slot
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

    // Upload the file immediately to the server
    try {
      const response = await uploadProfilePhoto(photosData.userId, file);
      const uploadedPhotoUrl = response.photos[0]; // Assuming the backend returns an array of uploaded photos

      // Update photoUrls state with the new photo URL
      const newPhotoUrls = [...photosData.photoUrls];
      newPhotoUrls[index] = uploadedPhotoUrl; // Store the uploaded photo URL

      const newPhotos = [...photosData.photos];
      newPhotos[index] = file; // Keep the file for display purpose in the grid
      setPhotosData({ ...photosData, photoUrls: newPhotoUrls, photos: newPhotos });

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
    console.log("photo to delete: ", photoToDelete);
    try {
      await deleteProfilePhoto(photosData.userId, photoToDelete);

      // Update state after removing the photo
      const updatedPhotoUrls = [...photosData.photoUrls];
      updatedPhotoUrls[index] = null;

      const updatedPhotos = [...photosData.photos];
      updatedPhotos[index] = null;

      setPhotosData({ ...photosData, photoUrls: updatedPhotoUrls, photos: updatedPhotos });
      
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  
  return (
    <div className="image-upload-container">
      <h2>Last opp profilbilder</h2>
      <p>Profiler med flere bilder får mer oppmerksomhet</p>
      <div className="image-grid">
        {Array(6).fill(null).map((_, index) => (
          <div key={index} className="image-slot">
            {photosData.photos[index] ? (
              <div className="image-wrapper">
                <img 
                  src={URL.createObjectURL(photosData.photos[index])} 
                  alt={`Uploaded ${index}`} 
                  className="uploaded-image" 
                />
                <button 
                  className="remove-photo-button" 
                  onClick={() => handlePhotoRemove(index)}
                >
                  X
                </button>
              </div>
            ) : photosData.photoUrls && photosData.photoUrls[index] ? (
              <div className="image-wrapper">
                <img 
                  src={`$${photosData.photoUrls[index]}`}
                  alt={`Fetched ${index}`} 
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
                {/* Display error message for this specific slot */}
                {errorMessages[index] && <p style={{ color: 'red' }}>{errorMessages[index]}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosUploadGrid;

// import React, { useEffect, useState } from 'react';
// import { fetchProfilePhotos } from '../api/PhotosAPI';
// import '../styles/PhotosUploadGrid.css'; 

// const PhotosUploadGrid = ({ photosData, setPhotosData }) => {
//   // Fetch previously uploaded photos when the component loads
//   const [photos, setPhotos] = useState(Array(6).fill(null)); // Grid with 6 slots
//   const [errorMessages, setErrorMessages] = useState(Array(6).fill(''));

//   useEffect(() => {
//     const fetchUserPhotos = async () => {
//       try {
//         const fetchedPhotos = await fetchProfilePhotos(photosData.userId);
//         console.log('Fetched photos: ', fetchedPhotos);
//         setPhotosData((prevState) => ({ 
//           ...prevState, 
//           photoUrls: fetchedPhotos // Store URLs in the state
//         }));
//       } catch (error) {
//         console.error('Error fetching user photos:', error);
//       }
//     };

//     fetchUserPhotos();
//   }, [photosData.userId, setPhotosData]);

//   // Handle photo upload
//   const handlePhotosUpload = (index, event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const newPhotos = [...photosData.photos];
//       newPhotos[index] = file; // Store the file in the state for upload
//       setPhotosData({ ...photosData, photos: newPhotos });
//     }
//   };

//   // Handle photo removal
//   const handlePhotoRemove = (index) => {
//     const newPhotos = [...photosData.photos];
//     newPhotos[index] = null; // Remove the photo from the state
//     setPhotosData({ ...photosData, photos: newPhotos });
//   };

//   return (
//     <div className="image-upload-container">
//       <h2>Last opp profilbilder</h2>
//       <p>Profiler med flere bilder får mer oppmerksomhet. Du kan legge til flere bilder senere.</p>
//       <div className="image-grid">
//         {Array(6).fill(null).map((_, index) => (
//           <div key={index} className="image-slot">
//             {photosData.photos[index] ? (
//               <div className="image-wrapper">
//                 <img 
//                   src={URL.createObjectURL(photosData.photos[index])} 
//                   alt={`Uploaded ${index}`} 
//                   className="uploaded-image" 
//                 />
//                 <button 
//                   className="remove-photo-button" 
//                   onClick={() => handlePhotoRemove(index)}
//                 >
//                   X
//                 </button>
//               </div>
//             ) : photosData.photoUrls && photosData.photoUrls[index] ? (
//               <div className="image-wrapper">
//                 <img 
//                   src={`../../../backend${photosData.photoUrls[index]}`} 
//                   alt={`Fetched ${index}`} 
//                   className="uploaded-image" 
//                 />
//                 <button 
//                   className="remove-photo-button" 
//                   onClick={() => handlePhotoRemove(index)}
//                 >
//                   X
//                 </button>
//               </div>
//             ) : (
//               <label className="image-placeholder">
//                 <input 
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handlePhotosUpload(index, e)}
//                   className="image-input"
//                 />
//                 +
//               </label>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PhotosUploadGrid;