import React from 'react';
import { Box, Typography } from '@mui/material';

function LeftHalf() {
  return (
    <Box
      sx={{
        backgroundColor: '#ffcccc', // Set your desired background color here for left side
        width: '50%', // Take up half of the screen width
        display: 'flex',
        flexDirection: 'column', // Arrange children vertically
        alignItems: 'center', // Center items vertically
        border: '1px solid black', // Outline for visibility
        padding: '20px', // Padding for spacing
      }}
    >
      {/* Section 1 */}
      <Box
        sx={{
          marginBottom: '20px', // Spacing between sections
          width: '100%', // Full width within the left half
          border: '1px dashed #333', // Example border for section visibility
          padding: '10px', // Padding for section content
        }}
      >
        <Typography variant="h6" gutterBottom>
          Best Hero 1
        </Typography>
        <Typography variant="body1">
          Hero Details Placeholder
        </Typography>
      </Box>

      {/* Section 2 */}
      <Box
        sx={{
          marginBottom: '20px', // Spacing between sections
          width: '100%', // Full width within the left half
          border: '1px dashed #333', // Example border for section visibility
          padding: '10px', // Padding for section content
        }}
      >
        <Typography variant="h6" gutterBottom>
          Best Hero 2
        </Typography>
        <Typography variant="body1">
          Hero Details Placeholder
        </Typography>
      </Box>

      {/* Section 3 */}
      <Box
        sx={{
          width: '100%', // Full width within the left half
          border: '1px dashed #333', // Example border for section visibility
          padding: '10px', // Padding for section content
        }}
      >
        <Typography variant="h6" gutterBottom>
          Best Hero 3
        </Typography>
        <Typography variant="body1">
          Hero Details Placeholder
        </Typography>
      </Box>
    </Box>
  );
}

export default LeftHalf;
