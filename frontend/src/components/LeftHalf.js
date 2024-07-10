import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import heroMapping from './heroMapping'; // Import the hero mapping

function LeftHalf() {
  const [bestTurboHeroes, setBestTurboHeroes] = useState([]);
  const [bestAllPickHeroes, setBestAllPickHeroes] = useState([]);
  const [selectedTab, setSelectedTab] = useState('turbo'); // State to track selected tab

  useEffect(() => {
    const fetchBestHeroes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/matches');
        const matches = response.data;

        // Calculate stats for Turbo matches
        const turboMatches = matches.filter(match => match.game_mode === 23);
        const turboHeroStats = calculateHeroStats(turboMatches);

        // Calculate stats for All Pick matches
        const allPickMatches = matches.filter(match => match.game_mode === 22);
        const allPickHeroStats = calculateHeroStats(allPickMatches);

        // Determine top 3 heroes for Turbo and All Pick
        const topTurboHeroes = determineTopHeroes(turboHeroStats);
        const topAllPickHeroes = determineTopHeroes(allPickHeroStats);

        // Set state to render the top heroes
        setBestTurboHeroes(topTurboHeroes);
        setBestAllPickHeroes(topAllPickHeroes);
      } catch (error) {
        console.error('Error fetching best heroes:', error);
      }
    };

    fetchBestHeroes();
  }, []);

  // Function to calculate hero statistics
  const calculateHeroStats = (matches) => {
    const heroStats = {};

    matches.forEach(match => {
      const heroId = match.hero_id;

      if (!heroStats[heroId]) {
        heroStats[heroId] = {
          wins: 0,
          losses: 0,
          gpmTotal: 0,
          killsTotal: 0,
          deathsTotal: 0,
          assistsTotal: 0,
          matchesCount: 0
        };
      }

      heroStats[heroId].matchesCount++;
      heroStats[heroId].wins += match.win ? 1 : 0;
      heroStats[heroId].losses += match.win ? 0 : 1;
      heroStats[heroId].gpmTotal += match.gpm;
      heroStats[heroId].killsTotal += match.kills;
      heroStats[heroId].deathsTotal += match.deaths;
      heroStats[heroId].assistsTotal += match.assists;
    });

    return heroStats;
  };

  // Function to determine top 3 heroes based on stats
  const determineTopHeroes = (heroStats) => {
    const heroesWithStats = Object.keys(heroStats).map(heroId => {
      const stats = heroStats[heroId];
      const winRate = stats.matchesCount > 0 ? (stats.wins / stats.matchesCount) * 100 : 0;
      const averageGPM = stats.matchesCount > 0 ? stats.gpmTotal / stats.matchesCount : 0;
      const kdaRatio = stats.deathsTotal > 0 ? ((stats.killsTotal + stats.assistsTotal) / stats.deathsTotal).toFixed(2) : 0;

      return {
        heroId: parseInt(heroId),
        winRate,
        averageGPM,
        kdaRatio,
        matchesCount: stats.matchesCount
      };
    });

    // Sort heroes by win rate (descending), then by average GPM (descending), then by KDA ratio (descending)
    heroesWithStats.sort((a, b) => {
      if (a.winRate !== b.winRate) {
        return b.winRate - a.winRate;
      }
      if (a.averageGPM !== b.averageGPM) {
        return b.averageGPM - a.averageGPM;
      }
      return b.kdaRatio - a.kdaRatio;
    });

    // Select the top 3 heroes
    return heroesWithStats.slice(0, 3);
  };

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffcccc',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid black',
        padding: '20px',
      }}
    >
      {/* Tabs for filtering top heroes */}
      <Tabs
        variant="fullWidth"
        aria-label="Top Heroes Filters"
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ marginBottom: '20px', width: '100%' }}
      >
        <Tab value="turbo" label="Turbo" />
        <Tab value="allPick" label="All Pick" />
      </Tabs>

      {/* Display top heroes based on selected tab */}
      {selectedTab === 'turbo' && bestTurboHeroes.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Best Turbo Heroes
          </Typography>
          {bestTurboHeroes.map((hero, index) => (
            <Box
              key={hero.heroId}
              sx={{
                marginBottom: '20px',
                width: '100%',
                border: '1px dashed #333',
                padding: '10px',
                display: 'flex',  // Added to use flexbox for layout
                alignItems: 'center', // Align items vertically
              }}
            >
              {/* Hero Image Box */}
              <Box
                sx={{
                  width: '50px', // Adjust width as needed
                  height: '50px', // Adjust height as needed
                  marginRight: '10px', // Spacing between image and stats
                  backgroundColor: '#ccc', // Placeholder background color
                }}
              >
                {/* Add hero image or sprite here */}
              </Box>

              {/* Hero Stats */}
              <Box>
                <Typography variant="body1">
                  {index + 1}. Hero: {heroMapping[hero.heroId] || 'Unknown Hero'}
                </Typography>
                <Typography variant="body1">
                  Win Rate: {hero.winRate.toFixed(2)}%
                </Typography>
                <Typography variant="body1">
                  Average GPM: {hero.averageGPM.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  KDA Ratio: {hero.kdaRatio}
                </Typography>
                <Typography variant="body1">
                  Total Matches: {hero.matchesCount}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {selectedTab === 'allPick' && bestAllPickHeroes.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Best All Pick Heroes
          </Typography>
          {bestAllPickHeroes.map((hero, index) => (
            <Box
              key={hero.heroId}
              sx={{
                marginBottom: '20px',
                width: '100%',
                border: '1px dashed #333',
                padding: '10px',
                display: 'flex',  // Added to use flexbox for layout
                alignItems: 'center', // Align items vertically
              }}
            >
              {/* Hero Image Box */}
              <Box
                sx={{
                  width: '50px', // Adjust width as needed
                  height: '50px', // Adjust height as needed
                  marginRight: '10px', // Spacing between image and stats
                  backgroundColor: '#ccc', // Placeholder background color
                }}
              >
                {/* Add hero image or sprite here */}
              </Box>

              {/* Hero Stats */}
              <Box>
                <Typography variant="body1">
                  {index + 1}. Hero: {heroMapping[hero.heroId] || 'Unknown Hero'}
                </Typography>
                <Typography variant="body1">
                  Win Rate: {hero.winRate.toFixed(2)}%
                </Typography>
                <Typography variant="body1">
                  Average GPM: {hero.averageGPM.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  KDA Ratio: {hero.kdaRatio}
                </Typography>
                <Typography variant="body1">
                  Total Matches: {hero.matchesCount}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default LeftHalf;
