import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, CssBaseline, Toolbar, Grid, Paper } from '@mui/material';
import { createFamily } from '../api/api';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const Families = () => {
  const [newFamilyName, setNewFamilyName] = useState('');
  const [familyInfo, setFamilyInfo] = useState(null);
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCreateFamily = async () => {
    try {
      const newFamily = await createFamily(1, { name: newFamilyName }); // userId를 1로 가정
      setFamilyInfo(newFamily);
      setNewFamilyName('');
    } catch (error) {
      console.error('Error creating family:', error);
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
          <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={12} md={6}> {/* md={6}으로 설정하여 너비를 조정 */}
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  가족 생성
                </Typography>
                <TextField
                  label="가족 이름"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleCreateFamily}>
                  생성
                </Button>
                {familyInfo && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">가족 이름: {familyInfo.name}</Typography>
                    <Typography variant="h6">가족 구성원:</Typography>
                    <ul>
                      {familyInfo.members.map((member) => (
                        <li key={member.id}>{member.name}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Families;
