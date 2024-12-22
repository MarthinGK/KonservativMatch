import React, { useEffect, useState } from 'react';
import { fetchProfiles } from '../api/SearchAPI';
import { Link } from 'react-router-dom';
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

  // Update the debounced age range with a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAgeRange(ageRange);
    }, 500); // 0.5-second delay

    return () => clearTimeout(handler); // Clear the timeout if ageRange changes
  }, [ageRange]);

  // Fetch profiles whenever debouncedAgeRange or location changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const loadProfiles = async () => {
        try {
          const { data, totalPages } = await fetchProfiles(
            { min: debouncedAgeRange[0], max: debouncedAgeRange[1] },
            location,
            user.sub,
            page // Pass the current page
          );
          setProfiles(data);
          setTotalPages(totalPages); // Update total pages
        } catch (error) {
          console.error("Error fetching profiles:", error);
        }
      };
      loadProfiles();
    }
  }, [debouncedAgeRange, location, page, isAuthenticated, user]);

  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
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
        <button onClick={goToPreviousPage} disabled={page === 1}>
          Forrige
        </button>
        <span>Side {page} av {totalPages}</span>
        <button onClick={goToNextPage} disabled={page === totalPages}>
          Neste
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
