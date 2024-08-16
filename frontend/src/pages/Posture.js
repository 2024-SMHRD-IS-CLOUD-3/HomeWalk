import React, { useState, useEffect, useRef } from 'react';
import { Box, CssBaseline, Toolbar, Container, Typography, Button, TextField, Grid, Paper, Tabs, Tab } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { uploadVideo } from '../api/postureApi';
import PostureScore from './PostureScore'; // 부화면 컴포넌트 가져오기

import { useDrawer } from '../context/DrawerContext'; // 드로어 상태 가져오기
import { useAuth } from '../context/AuthContext'; // 사용자 인증 정보 가져오기

const Posture = () => {
  const { open, toggleDrawer } = useDrawer();
  const { userObject } = useAuth(); // 사용자 정보 가져오기
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 탭 상태 관리
  const videoRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a video file first!');
      return;
    }

    try {
      const url = await uploadVideo(selectedFile, userObject?.userId); // 사용자 ID 추가
      setVideoUrl(url);
    } catch (error) {
      alert('Failed to upload the video. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // 새로운 영상 로드
      videoRef.current.play(); // 자동 재생
    }
  }, [videoUrl]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upload Video" />
              <Tab label="Score History" />
            </Tabs>

            {tabValue === 0 && (
              <>
                <Typography variant="h4" gutterBottom>
                  {userObject ? `${userObject.username}님의` : ''} 자세 분석을 위한 비디오 업로드
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
                      비디오 업로드
                    </Button>
                  </Grid>
                </Grid>
                {videoUrl && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                      업로드된 비디오
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <video
                        ref={videoRef}
                        controls
                        autoPlay
                        style={{ maxWidth: '100%', height: 'auto' }}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                  </Box>
                )}
              </>
            )}
            {tabValue === 1 && (
              <PostureScore userId={userObject?.userId} username={userObject?.username} />
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Posture;
