import React, { useState } from 'react';
import { 
  Container, Typography, Box, CssBaseline, Toolbar, Grid, Paper,
  TextField, Button, IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const Input = styled('input')({
  display: 'none',
});

const CreatePost = () => {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 여기에 글 작성 제출 로직을 구현합니다.
    console.log({ title, content, image });
    // 실제로는 이 데이터를 서버로 보내야 합니다.
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
                <Grid item xs={12}>
                  <label htmlFor="icon-button-file">
                    <Input 
                      accept="image/*" 
                      id="icon-button-file" 
                      type="file"
                      onChange={handleImageUpload} 
                    />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  {image && (
                    <Box mt={2}>
                      <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    작성하기
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