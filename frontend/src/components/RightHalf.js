import React, { useEffect, useState } from 'react';
import { Box, Typography, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import { heroNamesMapping, heroImagesMapping } from './heroMapping';
import gameModeMapping from './gameModeMapping'; // Import the game mode mapping
import '../HeroStyles.css'; // Import your CSS file

function RightHalf() {
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null); // State for selected filter
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true); // Start loading state
        const response = await axios.get('https://dota-hero-tracker-nodejs.onrender.com/matches');
        const sortedMatches = response.data.sort((a, b) => b.match_id - a.match_id);
        setMatches(sortedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false); // End loading state
      }
    };

    fetchMatches();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedFilter(newValue);
  };

  // Define filter tabs
  const filterTabs = [
    { id: null, label: 'All Matches' }, // null represents no filter (all matches)
    { id: 22, label: 'All Pick' },
    { id: 23, label: 'Turbo' },
  ];

  // Filter matches based on selected filter
  const filteredMatches = selectedFilter !== null
    ? matches.filter(match => match.game_mode === selectedFilter)
    : matches;

  return (
    <Box
      sx={{
        backgroundColor: '#cce6ff',
        width: '50%',
        border: '0px solid black',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Game Links
      </Typography>
      
      {/* Filter Tabs */}
      <Tabs value={selectedFilter} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary">
        {filterTabs.map(tab => (
          <Tab key={tab.id} value={tab.id} label={tab.label} />
        ))}
      </Tabs>

      {/* Conditional rendering based on isLoading */}
      {isLoading ? (
        <div className="loading-container">
          <p>Fetching match data, please wait...</p>
          <img src="/loading.gif" alt="Loading" className="custom-loading-gif" />
        </div>
      ) : (
        <Box
          sx={{
            backgroundColor: '#e0e0e0',
            border: '1px solid black',
            padding: '10px',
            flexGrow: 1,
            overflowY: 'auto',
            maxHeight: '80vh',
          }}
        >
          {filteredMatches.map((match) => (
            <Box
              key={match.match_id}
              sx={{
                backgroundColor: '#fff',
                border: '1px dashed #333',
                marginBottom: '10px',
                padding: '10px',
                display: 'flex', // Ensure items are displayed in a row
                alignItems: 'center', // Center items vertically
              }}
            >
              {/* Hero Image */}
              <div
                className={`hero-image ${heroImagesMapping[match.hero_id]}`} // Dynamically assign hero class
                style={{ width: '32px', height: '32px', marginRight: '10px', transform: 'scale(1.2)' }} // Adjust size and scaling as needed
              ></div>

              {/* Match Details */}
              <Box>
                <Typography variant="body1">
                  <a href={`https://www.dotabuff.com/matches/${match.match_id}`} target="_blank" rel="noopener noreferrer">
                    Match ID: {match.match_id}
                  </a>
                </Typography>
                <Typography variant="body2">Player ID: {match.player_id}</Typography>
                <Typography variant="body2">Hero: {heroNamesMapping[match.hero_id] || 'Unknown Hero'}</Typography>
                <Typography variant="body2">Win: {match.win ? 'Yes' : 'No'}</Typography>
                <Typography variant="body2">GPM: {match.gpm}</Typography>
                <Typography variant="body2">Kills: {match.kills}</Typography>
                <Typography variant="body2">Deaths: {match.deaths}</Typography>
                <Typography variant="body2">Assists: {match.assists}</Typography>
                <Typography variant="body2">Game Mode: {gameModeMapping[match.game_mode] || 'Unknown Mode'}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default RightHalf;
