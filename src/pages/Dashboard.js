import React, { useState, useRef } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Grid,
  Menu,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import {
  CloudUpload,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Info as InfoIcon,
  People,
  MoreVert,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DataUploader from '../components/data/DataUploader';
import PerformanceChart from '../components/charts/PerformanceChart';
import DemographicsChart from '../components/charts/DemographicsChart';

// Import the provided image
import DashboardHeaderImage from '../assets/dashboard-header.png'; // Adjust path as needed

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // Professional blue
    secondary: { main: '#D32F2F' }, // Red from image
    background: { default: '#E8F5E9' }, // Lighter teal-green background
    chartAccent: { main: 'rgba(211, 47, 47, 0.8)' }, // Red with adjusted opacity
    neutral: { main: '#424242' }, // Dark gray for text
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: { fontWeight: 700, color: '#1976d2', letterSpacing: 1 },
    h6: { fontWeight: 600, color: '#424242' },
    body1: { color: '#666' },
  },
});

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const performanceChartRef = useRef(null);

  const handleDataUpload = (uploadedData) => {
    console.log('Uploaded Data:', uploadedData);
    setData(Array.isArray(uploadedData) ? uploadedData : []);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPerformanceData = () => {
    if (!data || data.length === 0) {
      return { labels: [], values: [], maxValue: 0 };
    }
    const regions = [...new Set(data.map((student) => student.Region || 'Unknown'))];
    const performanceValues = regions.map((region) => {
      const regionData = data.filter((student) => student.Region === region);
      return regionData.length > 0
        ? regionData.reduce((sum, student) => sum + (Number(student.Score) || 0), 0) / regionData.length
        : 0;
    });
    const maxValue = Math.max(...performanceValues, 4); // Cap at 4 for GPA scale
    return { labels: regions, values: performanceValues, maxValue };
  };

  const performanceData = getPerformanceData();

  const downloadCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + data.map((row) => Object.values(row).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  const downloadChartImage = () => {
    if (performanceChartRef.current?.chartInstance) {
      const url = performanceChartRef.current.chartInstance.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = 'performance_chart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    handleMenuClose();
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Education Viz</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/students" state={{ studentData: data }}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Students" />
        </ListItem>
        <ListItem button component={Link} to="/about">
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: theme.palette.primary.main }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff' }}>
              Ethiopia Education Dashboard
            </Typography>
            {data.length > 0 && (
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            )}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={downloadChartImage}>Download Chart Image</MenuItem>
              <MenuItem onClick={downloadCSV}>Download CSV</MenuItem>
              <MenuItem onClick={downloadJSON}>Download JSON</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', background: '#fff', borderRight: '1px solid #ddd' },
          }}
        >
          {drawer}
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 4, background: theme.palette.background.default }}>
          <Toolbar />
          {/* Header Image Section (Visible Before Data Upload) */}
          <Paper elevation={6} sx={{ mb: 5, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)' }}>
            <Box sx={{ position: 'relative', p: 2 }}>
              <img
                src={DashboardHeaderImage}
                alt="Data Visualization Icons"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  opacity: 0.9,
                  filter: 'brightness(1.2) contrast(1.15)', // Enhanced for better contrast
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#fff',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)', // Stronger shadow for readability
                  background: 'rgba(0, 0, 0, 0.3)', // Slight background for text contrast
                  padding: '10px 20px',
                  borderRadius: 8,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
                  Explore Education Insights
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, background: theme.palette.chartAccent.main, '&:hover': { background: '#B71C1C' }, borderRadius: 20 }}
                  component={Link} to="/students"
                  disabled={data.length === 0}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={4}>
            {/* Data Upload */}
            <Grid item xs={12} md={4}>
              <Paper elevation={6} sx={{ p: 3, height: '100%', borderRadius: 12, background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  <CloudUpload sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.secondary.main }} /> Upload Data
                </Typography>
                <DataUploader onDataUpload={handleDataUpload} />
              </Paper>
            </Grid>

            {/* Visualization Section (Only After Data Upload) */}
            {data.length > 0 && (
              <Grid item xs={12} md={8}>
                <Paper elevation={6} sx={{ p: 3, borderRadius: 12, background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: '#fff' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                          Student Performance by Region
                        </Typography>
                        <PerformanceChart data={performanceData} ref={performanceChartRef} options={{
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 4, // Cap at 4 for GPA
                              ticks: {
                                stepSize: 0.5, // More granular steps
                                callback: (value) => value.toFixed(1), // Show one decimal
                              },
                              title: { display: true, text: 'Average GPA', color: theme.palette.neutral.main },
                            },
                            x: {
                              title: { display: true, text: 'Region', color: theme.palette.neutral.main },
                            },
                          },
                          plugins: {
                            legend: { display: false }, // Hide legend if not needed
                          },
                          barPercentage: 0.8, // Adjust bar width for spacing
                          categoryPercentage: 0.9,
                        }} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper elevation={4} sx={{ p: 2, borderRadius: 8, background: '#fff' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                          Student Demographics
                        </Typography>
                        <DemographicsChart data={data} />
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 6, py: 3, textAlign: 'center', borderTop: '2px solid #ddd', color: theme.palette.neutral.main }}>
            <Typography variant="body1">
              © 2025 Jimma University - Ethiopia Education Visualization Project
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;