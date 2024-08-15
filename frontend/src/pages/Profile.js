import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CssBaseline, Toolbar, Grid, Paper, TextField, Button, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, Menu } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { fetchUserProfile, updateUserProfile, uploadProfileImage, getDeactivationReasons, deactivateUser } from '../api/profile';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { setAvatarCustomization, logout } = useAuth(); 
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localAvatar, setLocalAvatar] = useState('');
  const [serverAvatar, setServerAvatar] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false); 
  const [reasons, setReasons] = useState([]); 
  const [selectedReason, setSelectedReason] = useState(''); 
  const [additionalComments, setAdditionalComments] = useState(''); 
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false); // 아바타 삭제 여부

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (token) {
          const userData = await fetchUserProfile(token);
          const { username, password, email, avatarCustomization } = userData;
          setUsername(username);
          setPassword(password);
          setEmail(email);
          setLocalAvatar(avatarCustomization);
          setServerAvatar(avatarCustomization);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    const fetchReasons = async () => {
      try {
        const reasonsData = await getDeactivationReasons();
        setReasons(reasonsData);
      } catch (error) {
        console.error('Failed to fetch deactivation reasons', error);
      }
    };

    fetchUserData();
    fetchReasons();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setLocalAvatar(localUrl);
    setIsAvatarDeleted(false); // 아바타가 변경되면 삭제 상태 해제
    setAnchorEl(null); // 메뉴 닫기
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      let uploadedImagePath = serverAvatar;

      if (isAvatarDeleted) {
        uploadedImagePath = ''; // 기본 아바타로 설정
      } else if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        uploadedImagePath = await uploadProfileImage(token, formData);
      }

      const updatedUserData = {
        username,
        password,
        email,
        avatarCustomization: uploadedImagePath,
      };

      await updateUserProfile(token, updatedUserData);
      setAvatarCustomization(localAvatar);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleDeactivate = () => {
    setDeactivateModalOpen(true);
  };

  const handleConfirmDeactivation = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await deactivateUser(token, selectedReason, additionalComments);
      setDeactivateModalOpen(false);
      logout();
      alert('Account deactivated successfully');
    } catch (error) {
      alert('Failed to deactivate account');
    }
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteAvatar = () => {
    setLocalAvatar(''); // 기본 아바타로 설정
    setIsAvatarDeleted(true); // 아바타 삭제 플래그 설정
    setAnchorEl(null); // 메뉴 닫기
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
                  <IconButton color="primary" onClick={handleAvatarClick} sx={{ ml: -4, mt: 6 }}>
                    <PhotoCamera />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem component="label">
                      사진 변경
                      <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                    </MenuItem>
                    <MenuItem onClick={handleDeleteAvatar}>
                      사진 삭제
                    </MenuItem>
                  </Menu>
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button variant="contained" color="primary" onClick={handleUpdate}>
                    수정
                  </Button>

                  <Button variant="outlined" color="error" onClick={handleDeactivate}>
                    탈퇴
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 탈퇴 확인 모달 */}
      <Dialog
        open={isDeactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>탈퇴 이유를 선택해주세요</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>탈퇴 이유</InputLabel>
            <Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              label="탈퇴 이유"
            >
              {reasons.map((reason) => (
                <MenuItem key={reason.reasonId} value={reason.reasonId}>
                  {reason.reasonText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="추가 코멘트"
            multiline
            rows={4}
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateModalOpen(false)} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmDeactivation} color="error">
            탈퇴
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
