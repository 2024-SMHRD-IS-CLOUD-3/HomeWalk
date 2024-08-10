import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CssBaseline, Toolbar, Grid, Paper, TextField, Button, Avatar, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { fetchUserProfile, updateUserProfile, uploadProfileImage } from '../api/profile';
import { useAuth } from '../context/AuthContext'; // AuthContext 가져오기

const Profile = () => {
  const { setAvatarCustomization } = useAuth(); // AuthContext에서 setAvatarCustomization 가져오기
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localAvatar, setLocalAvatar] = useState(''); // 로컬 상태용으로 다른 이름 사용
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (token) {
          const userData = await fetchUserProfile(token); // fetchUserProfile로 사용자 정보 가져오기
          const { username, password, email, avatarCustomization } = userData;
          setUsername(username);
          setPassword(password);
          setEmail(email);
          setLocalAvatar(avatarCustomization); // DB에서 가져온 경로로 설정
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setLocalAvatar(localUrl); // 로컬 URL로 미리보기 업데이트 (AppBar에는 반영하지 않음)
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await uploadProfileImage(token, formData);

        // 수정이 완료된 후에만 AppBar의 이미지를 업데이트
        setAvatarCustomization(localAvatar);
      }

      const updatedUserData = {
        username,
        password,
        email,
        avatarCustomization: localAvatar, // 이 상태는 로컬 URL을 그대로 유지합니다.
      };
      
      await updateUserProfile(token, updatedUserData);

      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  내 프로필
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar src={localAvatar} sx={{ width: 100, height: 100 }} />
                  <IconButton color="primary" component="label" sx={{ ml: -4, mt: 6 }}>
                    <PhotoCamera />
                    <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                  </IconButton>
                </Box>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  수정
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
