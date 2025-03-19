import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const About = () => {
  return (
    <Paper elevation={3} sx={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <InfoIcon sx={{ mr: 1 }} /> About This System
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          Welcome to the Ethiopia Education Dashboard, designed to enhance student outcomes in Ethiopia’s education sector. 
          This prototype, developed as part of a Master’s thesis at Jimma University (January 2025), visualizes data from 
          universities and high schools to support data-driven decisions. 
        </Typography>
        <Typography variant="body1" paragraph>
          By uploading student data, users can explore regional performance, demographics, and trends, empowering 
          educators, administrators, and policymakers to improve educational quality. The system leverages modern 
          visualization techniques to transform complex datasets into actionable insights, addressing the need for 
          digital tools in Ethiopia's education landscape.
        </Typography>
      </Box>
    </Paper>
  );
};

export default About;