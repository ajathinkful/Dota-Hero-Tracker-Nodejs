import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import { NavigateBefore, NavigateNext, Pause, PlayArrow } from '@mui/icons-material';
import '../HeroStyles.css'; // Import hero image CSS styles
import axios from 'axios'; // Import axios for fetching data

const heroNames = [
  'Abaddon', 'Alchemist', 'Ancient Apparition', 'Anti-Mage', 'Arc Warden', 'Axe', 'Bane', 'Batrider',
  'Beastmaster', 'Bloodseeker', 'Bounty Hunter', 'Brewmaster', 'Bristleback', 'Broodmother', 'Centaur Warrunner', 'Chaos Knight',
  'Chen', 'Clinkz', 'Clockwerk', 'Crystal Maiden', 'Dark Seer', 'Dark Willow', 'Dawnbreaker', 'Dazzle',
  'Death Prophet', 'Disruptor', 'Doom', 'Dragon Knight', 'Drow Ranger', 'Earth Spirit', 'Earthshaker', 'Elder Titan',
  'Ember Spirit', 'Enchantress', 'Enigma', 'Faceless Void', 'Grimstroke', 'Gyrocopter', 'Hoodwink', 'Huskar',
  'Invoker', 'Io', 'Jakiro', 'Juggernaut', 'Keeper of the Light', 'Kunkka', 'Legion Commander', 'Leshrac',
  'Lich', 'Lifestealer', 'Lina', 'Lion', 'Lone Druid', 'Luna', 'Lycan', 'Magnus',
  'Mars', 'Medusa', 'Meepo', 'Mirana', 'Monkey King', 'Morphling', 'Naga Siren', 'Natures Prophet',
  'Necrophos', 'Night Stalker', 'Nyx Assassin', 'Ogre Magi', 'Omniknight', 'Oracle', 'Outworld Destroyer', 'Pangolier',
  'Phantom Assassin', 'Phantom Lancer', 'Phoenix', 'Primal Beast', 'Puck', 'Pudge', 'Pugna', 'Queen of Pain', 'Razor',
  'Riki', 'Rubick', 'Sand King', 'Shadow Demon', 'Shadow Fiend', 'Shadow Shaman', 'Silencer', 'Skywrath Mage',
  'Slardar', 'Slark', 'Snapfire', 'Sniper', 'Spectre', 'Spirit Breaker', 'Storm Spirit', 'Sven',
  'Techies', 'Templar Assassin', 'Terrorblade', 'Tidehunter', 'Timbersaw', 'Tinker', 'Tiny', 'Treant Protector',
  'Troll Warlord', 'Tusk', 'Underlord', 'Undying', 'Ursa', 'Vengeful Spirit', 'Venomancer', 'Viper',
  'Visage', 'Void Spirit', 'Warlock', 'Weaver', 'Windranger', 'Winter Wyvern', 'Witch Doctor', 'Wraith King',
  'Zeus'
];

function TitleBox() {
  const heroIds = heroNames.map(hero => hero.toLowerCase().replace(/\s+/g, '-'));

  // Initialize state with a random hero index
  const [currentHeroIndex, setCurrentHeroIndex] = useState(() => Math.floor(Math.random() * heroIds.length));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to track dropdown open/close
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State to control snackbar message

  const heroId = heroIds[currentHeroIndex]; // Current hero id/name based on index

  const handleClick = () => {
    // Handle clicking on the hero image
    console.log(`Clicked on hero ${heroNames[currentHeroIndex]}`);
    // Replace with your navigation logic or link handling
  };

  const handleLeftArrowClick = useCallback(() => {
    setCurrentHeroIndex(prevIndex => (prevIndex === 0 ? heroIds.length - 1 : prevIndex - 1));
    setIsTransitioning(false); // Disable transition effect for manual navigation
  }, [heroIds]);

  const handleRightArrowClick = useCallback(() => {
    setCurrentHeroIndex(prevIndex => (prevIndex === heroIds.length - 1 ? 0 : prevIndex + 1));
    setIsTransitioning(false); // Disable transition effect for manual navigation
  }, [heroIds]);

  useEffect(() => {
    if (!isPaused && !isDropdownOpen) { // Check if dropdown is not open
      const interval = setInterval(() => {
        setIsTransitioning(true); // Enable transition effect for automatic change
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * heroIds.length);
          setCurrentHeroIndex(randomIndex);
          setIsTransitioning(false);
        }, 500); // Duration of the transition effect
      }, 3800); // Change hero every 3.8 seconds (adjusted from 10 seconds for demo purposes)

      return () => clearInterval(interval);
    }
  }, [isPaused, heroIds, isDropdownOpen]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
    setIsTransitioning(false); // Disable transition effect when paused
  };

  const handleHeroChange = (event) => {
    const selectedHeroId = event.target.value;
    const newIndex = heroIds.findIndex(id => id === selectedHeroId);
    if (newIndex !== -1) {
      setCurrentHeroIndex(newIndex);
      setIsTransitioning(false); // Disable transition effect for manual hero change
    }
  };

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const fetchLatestMatchData = async () => {
    try {
      const response = await axios.get('https://dota-hero-tracker-nodejs.onrender.com/fetch-and-store-matches');
      console.log(response.data.message);
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload(); // Reload the page after 2 seconds
      }, 2000);
    } catch (error) {
      console.error('Error fetching and storing matches:', error);
      setSnackbarMessage('Error fetching and storing matches');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        width: 'auto', // Take up remaining width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px', // Add padding for spacing
        border: '1px solid black', // Outline for visibility (can be removed if not needed)
      }}
    >
      {/* Title */}
      <Typography variant="h4" gutterBottom style={{ marginTop: '-20px', textAlign: 'center', }}>
        Dota Hero Tracker
      </Typography>

      {/* Spacer */}
      <Box sx={{ height: '100px' }} />

      {/* Hero Image and Name */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <a
          href={`https://www.dotabuff.com/heroes/${heroNames[currentHeroIndex].toLowerCase().replace(/\s+/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          <Box
            className={`hero-image hero-${heroId}`} // Dynamically assign hero class
            style={{
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              marginBottom: '20px', // Increased margin between image and name
              transform: 'scale(1.9)', // Magnify by 90%
              opacity: isTransitioning ? 0 : 1, // Adjust opacity based on transition state
              transition: 'opacity 0.5s ease-in-out', // Apply transition to opacity only
            }}
          ></Box>
        </a>

        {/* Hero Name Dropdown */}
        <Select
          value={heroId}
          onChange={handleHeroChange}
          onOpen={handleDropdownOpen} // Set the open/close handlers for dropdown
          onClose={handleDropdownClose}
          sx={{ marginTop: '5px' }}
        >
          {heroIds.map(id => (
            <MenuItem key={id} value={id}>{heroNames[heroIds.indexOf(id)]}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Navigation Arrows */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
        }}
      >
        <IconButton onClick={handleLeftArrowClick}>
          <NavigateBefore />
        </IconButton>
        <IconButton onClick={togglePause}>
          {isPaused ? <PlayArrow /> : <Pause />}
        </IconButton>
        <IconButton onClick={handleRightArrowClick}>
          <NavigateNext />
        </IconButton>
      </Box>

      {/* Fetch Latest Match Data Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: '20px' }}
        onClick={fetchLatestMatchData}
      >
        Get Latest Match Data
      </Button>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TitleBox;
