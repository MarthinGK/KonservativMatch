import React, { useEffect, useState } from 'react';
import { searchFetchProfiles } from '../api/SearchAPI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/SearchPage.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useAuth0 } from '@auth0/auth0-react';

const SearchPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [profiles, setProfiles] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 100]);
  const [location, setLocation] = useState('');
  const [debouncedAgeRange, setDebouncedAgeRange] = useState(ageRange);

  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages

  const locationState = useLocation(); // Get current location
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(locationState.search);
  const currentPage = parseInt(queryParams.get('page')) || 1; // Default to page 1

  // Update the debounced age range with a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAgeRange(ageRange);
    }, 500); // 0.5-second delay

    return () => clearTimeout(handler); // Clear the timeout if ageRange changes
  }, [ageRange]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadProfiles = async () => {
        try {
          const data = await searchFetchProfiles(
            { min: debouncedAgeRange[0], max: debouncedAgeRange[1] },
            location,
            user.sub,
            currentPage
          );
          setProfiles(data.data); // `data` contains the profiles
          setTotalPages(data.totalPages); // `totalPages` from the backend
        } catch (error) {
          console.error('Error fetching profiles:', error);
        }
      };
      loadProfiles();
    }
  }, [debouncedAgeRange, location, isAuthenticated, user, currentPage]);

  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePageChange = (page) => {
    navigate(`/search?page=${page}`); // Update URL with the selected page
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      navigate(`/search?page=${currentPage + 1}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      navigate(`/search?page=${currentPage - 1}`);
    }
  };

  return (
    <div className="search-page">
      <h2>Søk profiler</h2>

      {/* Filter Form */}
      <div className="search-filter-form">
        <label className="age-slider-container">
          Alder: {ageRange[0]} - {ageRange[1]}
          <Slider
            range
            min={18}
            max={120}
            value={ageRange}
            onChange={handleAgeChange}
            renderThumb={(props, state) => (
              <div {...props} className="slider-thumb">
                <span className="age-label">{state.valueNow}</span>
              </div>
            )}
          />
        </label>
        <label className="location-select">
          Lokasjon:
          <select value={location} onChange={handleLocationChange}>
            <option value="">Alle</option>
            <option value="Agder">Agder</option>
            <option value="Akershus">Akershus</option>
            <option value="Buskerud">Buskerud</option>
            <option value="Finnmark">Finnmark</option>
            <option value="Innlandet">Innlandet</option>
            <option value="Møre og Romsdal">Møre og Romsdal</option>
            <option value="Nordland">Nordland</option>
            <option value="Oslo">Oslo</option>
            <option value="Rogaland">Rogaland</option>
            <option value="Telemark">Telemark</option>
            <option value="Troms">Troms</option>
            <option value="Trøndelag">Trøndelag</option>
            <option value="Vestfold">Vestfold</option>
            <option value="Vestland">Vestland</option>
            <option value="Østfold">Vestfold</option>
          </select>
        </label>
      </div>


      {/* Profiles Grid */}
      <div className="search-profiles-grid">
        {profiles.map((profile, index) => (
          <div className="search-exploreprofile" key={index}>
            <Link to={`/bruker/${profile.profile_id}`}>
              <img src={`${profile.profile_photo}`} alt={`${profile.first_name}`} className="search-profile-picture" />
              <div className="search-exploreprofile-background">
                <p className="search-exploreprofile-name">{profile.first_name}, {calculateAge(profile.date_of_birth)}</p>
                <p className="search-exploreprofile-location">{profile.location}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          className="pagination-arrow"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          &#10094; {/* Left Arrow */}
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => navigate(`/search?page=${page}`)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-arrow"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          &#10095; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default SearchPage;
