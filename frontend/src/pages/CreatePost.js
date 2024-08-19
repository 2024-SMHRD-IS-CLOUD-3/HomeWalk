import React, { useState } from 'react';
import { 
  Container, Typography, Box, CssBaseline, Toolbar, Grid, Paper,
  TextField, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { usePostContext } from '../context/PostContext';  // PostContext에서 가져옵니다.
import { createPost } from '../api/community';  
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useAuth } from '../context/AuthContext';

const Input = styled('input')({
  display: 'none',
});

const CreatePost = () => {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { userObject } = useAuth();
  const { addNewPost } = usePostContext();  // PostContext에서 addNewPost 가져오기

  const userId = userObject?.userId;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleImageSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setImageFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!userId) {
      console.error("User ID is not set");
      return;
    }
  
    try {
      const postData = await createPost(userId, title, content, imageFile);

      // 새로 생성된 게시물을 바로 추가
      addNewPost(postData);

      navigate('/community');
    } catch (error) {
      console.error('게시글 등록 중 오류가 발생했습니다:', error);
    }
  };

  const handleCancel = () => {
    navigate('/community');
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
          <Typography variant="h4" component="h1" gutterBottom align='center'>
            새 글 작성
          </Typography>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <label htmlFor="icon-button-file">
                    <Input 
                      accept="image/*" 
                      id="icon-button-file" 
                      type="file"
                      onChange={handleImageSelect} 
                    />
                    <Button variant="outlined" color="primary" component="span">
                      이미지 선택
                    </Button>
                  </label>
                  {image && (
                    <Box mt={2}>
                      <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="내용"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" color="primary" type="submit">
                    작성하기
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    돌아가기
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default CreatePost;
