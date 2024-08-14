import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Container, Typography, Button, TextField, Grid, Paper } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { uploadVideo } from '../api/postureApi';

const Posture = () => {
  const [open, setOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a video file first!');
      return;
    }

    try {
      const url = await uploadVideo(selectedFile);
      setVideoUrl(url);
    } catch (error) {
      alert('Failed to upload the video. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Upload Video for Posture Analysis
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  type="file"
                  inputProps={{ accept: 'video/*' }}
                  onChange={handleFileChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleUpload}
                  sx={{ height: '100%' }}
                >
                  Upload Video
                </Button>
              </Grid>
            </Grid>
            {videoUrl && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Uploaded Video
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <video controls autoPlay style={{ maxWidth: '100%', height: 'auto' }}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Posture;
