import React from 'react';
import { Box, Typography } from '@mui/material';

function TitleBox() {
  return (
    <Box
      sx={{
        width: 'auto', // Take up remaining width
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px', // Add padding for spacing
        flexGrow: 1, // Allow this box to take up remaining space
        border: '1px solid black', // Outline for visibility
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dota Game Tracker
      </Typography>
    </Box>
  );
}

export default TitleBox;
