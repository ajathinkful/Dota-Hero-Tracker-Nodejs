import React from 'react';
import { Box } from '@mui/material';
import LeftHalf from './components/LeftHalf';
import TitleBox from './components/TitleBox';
import RightHalf from './components/RightHalf';

function Toggle() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',  // Arrange children horizontally
      }}
    >
      <LeftHalf />
      <TitleBox />
      <RightHalf />
    </Box>
  );
}

export default Toggle;
