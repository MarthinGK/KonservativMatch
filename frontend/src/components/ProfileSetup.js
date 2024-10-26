import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState }  from "react";
import '../styles/ProfileSetup.css';
import { saveUserProfile } from '../api/UserAPI';
import { Navigate, useNavigate } from 'react-router-dom';
import LocationDropdown from "../components/LocationDropdown";
import { checkIfProfileIsComplete } from "../api/UserAPI";
import PhotosUploadGrid from "./PhotosUploadGrid";
import { uploadProfilePhoto, fetchProfilePhotos } from "../api/PhotosAPI";

const ProfileSetup = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [errorMessage, setErrorMessage] = useState('');
  const [isInputValid, setIsInputValid] = useState(true);
  const [introText, setIntroText] = useState('');

  const handleInputChange = (e) => {
    setIntroText(e.target.value);
  };

  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUser = async () => {
      if (isAuthenticated && user) {
        try {
          const isProfileComplete = await checkIfProfileIsComplete(user);
          if (isProfileComplete) {
            localStorage.setItem('profile_complete', true);
            navigate('/');  // Use navigate function instead of returning <Navigate>
          }
        } catch (error) {
          localStorage.clear(); // Clear localStorage if not authenticated
          console.error('Error checking user in ProfileSetup.js:', error);
        }
      }
      else if (!isAuthenticated || !user){
        navigate('/'); 
      }
    };
  
    checkUser();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Add no-scroll class to the body when the component mounts
    document.body.classList.add('no-scroll');

    // Remove no-scroll class when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    userId: user.sub,
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: '',
    location: '',
    religion: '',
    alcohol: '',
    smoking: '',
    height: 175,
    introduction: '',
    profile_complete: false
  });

  const [photosData, setPhotosData] = useState({
    userId: user.sub,
    photos: '',
    photoUrl: ''
  });


  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-ZæøåÆØÅ\s]*$/;

    // Allow the user to type and immediately validate character input
    setProfileData({
      ...profileData,
      [name]: value
    });

    // If input has invalid characters, show an error message
    if (!regex.test(value)) {
      setIsInputValid(false); // Input is invalid
      setErrorMessage('OPS! Kun bokstaver er tillatt'); // Immediate error for invalid characters
    } else {
      setIsInputValid(true);  // Input is valid
      setErrorMessage('');    // Clear error message
    }
  };

  const validateField = (field, type, minLength = 0, maxLength = Infinity) => {
    const value = profileData[field];
  
    if (type === 'int') {
      const intValue = parseInt(value, 10);
      if (isNaN(intValue) || !Number.isInteger(intValue)) {
        setErrorMessage(`Invalid integer for ${field}`);
        setIsInputValid(false);
        return false;
      }
    }
  
    if (type === 'string') {
      const regex = /^[a-zA-ZæøåÆØÅ\s]*$/;
      if (value.trim() === "" || !regex.test(value)) {
        setErrorMessage(`Invalid string for ${field}`);
        setIsInputValid(false);
        return false;
      }
    }
  
    if (type === 'text') {
      if (value.length < minLength || value.length > maxLength) {
        setErrorMessage(`Please write between ${minLength} and ${maxLength} characters.`);
        setIsInputValid(false);
        return false;
      }
    }
  
    // If all validations pass
    setIsInputValid(true);
    return true;
  };

  const checkInt = (field, errorMessage) => {
    if (!validateField(field, 'int')) {
      setErrorMessage(errorMessage);
      return;
    }

    const intValue = parseInt(profileData[field], 10);
    const updatedProfileData = {
      ...profileData,
      [field]: intValue
    };
    setProfileData(updatedProfileData);
    saveUserProfile(updatedProfileData);
    setStep(step + 1);
  };

  const checkText = (field, errorMessage) => {

    if (introText === "") {
      setErrorMessage(errorMessage);
    } 
    if (introText.length < 50 || introText.length > 500) {
      setErrorMessage("Vennligst skriv en introduksjon på 50 og 500 tegn");
    } 
    else {  
      // Create a cleaned profileData object
      const updatedProfileData = {
        ...profileData,
        profile_complete: true,
        [field]: introText
      };
      // Update the state with the cleaned value
      setProfileData((prevData) => ({
        ...prevData,
        profile_complete: true,
        [field]: introText
      }));
      // Save cleaned profile data
      saveUserProfile(updatedProfileData);
      
      // Proceed to the next step
      setStep(step + 1);
    }
  };

  const checkString = (field, errorMessage) => {
    if (!validateField(field, 'string')) {
      setErrorMessage(errorMessage);
      setIsInputValid(false); // Keeps "Neste" disabled if validation fails
      return;
    }
  
    const cleanedField = cleanField(profileData[field]);
    const updatedProfileData = {
      ...profileData,
      [field]: cleanedField
    };
    setProfileData(updatedProfileData);
    saveUserProfile(updatedProfileData);
    setStep(step + 1);
  };
  
  const checkPhoto = async () => {
    try {
      // Fetch the photos from the database using the user's ID
      const uploadedPhotos = await fetchProfilePhotos(photosData.userId);
  
      // Check if there are any photos in the database
      if (!uploadedPhotos || uploadedPhotos.length === 0) {
        setErrorMessage('Please upload at least one photo.');
        return;
      }
  
      // If there is at least one photo, proceed to the next step
      setStep(step + 1);
    } catch (error) {
      console.error('Error checking photos:', error);
      setErrorMessage('Error checking photos. Please try again.');
    }
  };

  // const checkPhoto = async (errorMessage) => {
  //   const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  //   // Ensure at least one photo is uploaded
  //   if (!photosData.photos || photosData.photos.length === 0) {
  //     setErrorMessage('Please upload at least one photo.');
  //     return;
  //   }
  
  //   // Validate file types
  //   const invalidFiles = photosData.photos.filter(photo => photo && !validImageTypes.includes(photo.type));
  //   if (invalidFiles.length > 0) {
  //     setErrorMessage('Invalid file type. Please upload valid images (JPEG, PNG).');
  //     return;
  //   }
  
  //   try {
  //     // Upload all files at once
  //     const formData = new FormData();
  //     formData.append('user_id', profileData.userId); 
  //     photosData.photos.forEach((photo, index) => {
  //       if (photo) formData.append(`photos[${index}]`, photo);
  //     });
  
  //     await uploadProfilePhoto(profileData.userId, formData); // Call API to upload
  //     setStep(step + 1); // Proceed to next step
  //   } catch (error) {
  //     setErrorMessage('Error uploading photos, please try again.');
  //   }
  // };

  // Move to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Move to the previous step (optional)
  const prevStep = () => {
    if (step > 1) {
      setErrorMessage(''); // Clear any error messages
      setIsInputValid(true);
      setStep(step - 1);
    }
  };

  const cleanField = (value) => {
    const cleanedValue = value.trim().replace(/\s+/g, ' ');
    return cleanedValue;
  };

  const verifyDateStep = () => {
    const { year, month, day } = profileData;
  
    // Ensure all fields are selected
    if (!year || !month || !day) {
      setErrorMessage('Vennligst oppgi en gyldig fødselsdato.');
      return;
    }
  
    const selectedDate = new Date(year, month - 1, day);  // Month is 0-indexed
    const currentDate = new Date();
  
    // Check if the date is valid (e.g., handles cases like February 30th)
    if (selectedDate.getDate() !== parseInt(day)) {
      setErrorMessage('Vennligst oppgi en gyldig fødselsdato.');
      return;
    }
  
    // Calculate age
    const age = currentDate.getFullYear() - selectedDate.getFullYear();
    const monthDiff = currentDate.getMonth() - selectedDate.getMonth();
    const dayDiff = currentDate.getDate() - selectedDate.getDate();
  
    let calculatedAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge--;  // Not yet reached birthday this year
    }
  
    // Age validation: must be between 18 and 120
    if (calculatedAge < 18) {
      setErrorMessage('Du må være minst 18 år gammel.');
      return;
    }
    if (calculatedAge > 120) {
      setErrorMessage('Vennligst oppgi en gyldig alder.');
      return;
    }
  
    // Clear any previous error and move to the next step
    setErrorMessage('');
    setProfileData({
      ...profileData,
      dateOfBirth: selectedDate.toISOString().split('T')[0], // Store in YYYY-MM-DD format
    });
    setStep(step + 1);
  };

  // Check if the user is authenticated, if not redirect to /home
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }

  // Render progress bar
  const renderProgressBar = () => {
    const progress = (step / 13) * 100;  // Assuming 13 steps
    return (
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  return (
    <div className="profile-setup">
      {renderProgressBar()}

      {step === 1 && (
        <div className="slide">
          <h1>La oss sette opp profilen din</h1>
          <button className="nextbutton" onClick={nextStep}>Neste</button>
        </div>
      )}

      {step === 2 && (
        <div className="slide">
          <h2>Hva er ditt fornavn?</h2>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleTextInputChange}
            placeholder="Fornavn"
            className="inputtext"
            maxLength={150}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkString('firstName', 'Whups, her mangler det et navn!')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="slide">
          <h2>Hva er ditt etternavn?</h2>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleTextInputChange}
            placeholder="Etternavn"
            className="inputtext"
            maxLength={150}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkString('lastName', 'Whups, her mangler det et navn!')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="slide">
          <h2>Fødselsdato</h2>
          <div className="birthdateinput">

            <select
              name="dag"
              value={profileData.day}
              onChange={(e) => setProfileData({ ...profileData, day: e.target.value })}
            >
              <option value="">Dag</option>
              {[...Array(31)].map((_, index) => (
                <option key={index} value={index + 1}>{index + 1}</option>
              ))}
            </select>

            <select
              name="måned"
              value={profileData.month}
              onChange={(e) => setProfileData({ ...profileData, month: e.target.value })}
            >
              <option value="">Måned</option>
              {["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"]
                .map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
            </select>
            
            <select
              name="år"
              value={profileData.year}
              onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
            >
              <option value="">År</option>
              {[...Array(100)].map((_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button className="nextbutton" onClick={verifyDateStep}>Neste</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="slide">
          <h2>Er du mann eller kvinne?</h2>
          <div>
            <button
              className={`profileSetupSelectButton ${profileData.gender === 'Mann' ? 'selected' : ''}`}
              onClick={() => {
                setProfileData({ ...profileData, gender: 'Mann' });
                setErrorMessage(''); // Clear error when a valid selection is made
                setIsInputValid(true); // Enable the "Neste" button
              }}
            >
              Mann
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.gender === 'Kvinne' ? 'selected' : ''}`}
              onClick={() => {
                setProfileData({ ...profileData, gender: 'Kvinne' });
                setErrorMessage(''); // Clear error when a valid selection is made
                setIsInputValid(true); // Enable the "Neste" button
              }}
            >
              Kvinne
            </button>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkString('gender', 'Vennligst oppgi kjønn')}
              disabled={!isInputValid} // Disables "Neste" if no gender is selected
            >
              Neste
            </button>
          </div>
        </div>
      )}
      
      {step === 6 && (
        <div className="slide">
        <LocationDropdown
          profileData={profileData}
          setProfileData={setProfileData}
        />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkString('location', 'Vennligst oppgi et fylke')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

    {step === 7 && (
    <div className="slide">
        <h2>Hva er ditt livssyn?</h2>
        <div>
        <button
            className={`profileSetupSelectButton ${profileData.religion === 'Ateist' ? 'selected' : ''}`}
            onClick={() => setProfileData({ ...profileData, religion: 'Ateist' })}
        >
            Ateist
        </button>
        <button
            className={`profileSetupSelectButton ${profileData.religion === 'Agnostisk' ? 'selected' : ''}`}
            onClick={() => setProfileData({ ...profileData, religion: 'Agnostisk' })}
        >
            Agnostisk
        </button>
        <button
            className={`profileSetupSelectButton ${profileData.religion === 'Kristen' ? 'selected' : ''}`}
            onClick={() => setProfileData({ ...profileData, religion: 'Kristen' })}
        >
            Kristen
        </button>
        </div>
        <h4>Annet? Spesifiser: </h4>
        <input
        type="text"
        name="religion"
        value={profileData.religion}
        onChange={handleTextInputChange}
        placeholder="Livssyn"
        className="inputtext"
        maxLength={35}
        />

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <hr className="divider" />
        <div className="button-container">
        <button className="nextbutton" onClick={prevStep}>Tilbake</button>
        <button
            className="nextbutton"
            onClick={() => checkString('religion', 'Vennligst oppgi livssyn')}
            disabled={!isInputValid}
        >
            Neste
        </button>
        </div>
    </div>
    )}

      {step === 8 && (
        <div className="slide">
          <h2>Drikker du alkohol?</h2>
          <div>
            <button
              className={`profileSetupSelectButton ${profileData.alcohol === 'Aldri' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, alcohol: 'Aldri' })}
            > 
              Aldri
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.alcohol === 'Sjeldent' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, alcohol: 'Sjeldent' })}
            >
              Sjeldent
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.alcohol === 'Sosialt' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, alcohol: 'Sosialt' })}
            >
              Sosialt
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.alcohol === 'Ofte' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, alcohol: 'Ofte' })}
            >
              Ofte
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.alcohol === 'Hver dag' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, alcohol: 'Hver dag' })}
            >
              Hver dag
            </button>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkString('alcohol', 'Vennligst oppgi alkoholbruk')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {step === 9 && (
        <div className="slide">
          <h2>Røyker du?</h2>
          <div>
            <button
              className={`profileSetupSelectButton ${profileData.smoking === 'Aldri' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, smoking: 'Aldri' })}
            > 
              Aldri
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.smoking === 'Sjeldent' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, smoking: 'Sjeldent' })}
            >
              Sjeldent
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.smoking === 'Sosialt' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, smoking: 'Sosialt' })}
            >
              Sosialt
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.smoking === 'Ofte' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, smoking: 'Ofte' })}
            >
              Ofte
            </button>
            <button
              className={`profileSetupSelectButton ${profileData.smoking === 'Hver dag' ? 'selected' : ''}`}
              onClick={() => setProfileData({ ...profileData, smoking: 'Hver dag' })}
            >
              Hver dag
            </button>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkString('smoking', 'Vennligst oppgi røykevaner')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {step === 10 && (
        <div className="slide">
          <h2>Hva er din høyde?</h2>
          <input
            type="range"
            id="heightSlider"
            min={120}
            max={220}
            step={1}
            value={profileData.height}
            onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
            className="styled-slider"
          />
          <div>
            <p>Høyde: {profileData.height || 175} cm</p>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkInt('height', 'Vennligst angi en høyde')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {step === 11 && (
        <div className="slide">
          <PhotosUploadGrid
            photosData={photosData}
            setPhotosData={setPhotosData}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={checkPhoto} // Call the new checkPhoto function
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {step === 12 && (
        <div className="slide">
          <div>
          <h2>Skriv en kort introduksjon om deg selv </h2>
          </div>
          <div>
          <h4>
            Ta gjerne med litt om hobbyer, bakgrunn og jobb
          </h4>
          </div>
          <div style={{ position: 'relative' }}>
            <textarea
              type="text"
              name="introduction"
              value={introText}
              onChange={handleInputChange}
              maxLength={500}
              minLength={50}
              placeholder="kort intro"
              style={{
                width: '350px',
                height: '200px',
                padding: '10px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ position: 'absolute', bottom: '5px', right: '10px', color: '#999' }}>
              {500 - introText.length} characters left
            </div>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <hr className="divider" />
          <div className="button-container">
            <button className="nextbutton" onClick={prevStep}>Tilbake</button>
            <button
              className="nextbutton"
              onClick={() => checkText('introduction', 'Vennligst skriv en kort intro på mellom 50 og 500 tegn')}
              disabled={!isInputValid}
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {step === 13 && (
        <div className="slide">
        <h1>Gratulerer!</h1>
        <p>Du har fullført profilen din</p>
        <button className="nextbutton" onClick={() => navigate('/')}>Begynn å utforsk</button>
        </div>
      )}

    </div>
  );
};

export default ProfileSetup;