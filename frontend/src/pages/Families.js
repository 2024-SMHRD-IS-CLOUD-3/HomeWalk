import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, CssBaseline, Toolbar, Grid, Paper, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import { createFamily, getFamilies } from '../api/api';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const Families = () => {
  const [families, setFamilies] = useState([]);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(true);
  const [error, setError] = useState('');
  const userId = 1; // 실제 사용시 로그인한 사용자의 ID를 사용해야 합니다.

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const fetchedFamilies = await getFamilies(userId);
      setFamilies(fetchedFamilies);
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      setError('가족 이름을 입력하세요.');
      return;
    }

    try {
      await createFamily(userId, { familyName: newFamilyName });
      setNewFamilyName('');
      setError('');
      fetchFamilies(); // 새 가족을 생성한 후 목록을 갱신합니다.
    } catch (error) {
      console.error('Error creating family:', error);
      setError('가족 생성 중 오류가 발생했습니다.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFamilies = families.filter(family =>
    family.familyName && family.familyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, pl: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  가족 목록
                </Typography>
                <TextField
                  label="검색"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <List>
                  {filteredFamilies.map((family) => (
                    <React.Fragment key={family.familyId}>
                      <ListItem>
                        <ListItemText 
                          primary={family.familyName} 
                          secondary={`인원수: ${family.memberCount || 1}`} 
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  가족 생성
                </Typography>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
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
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Families;
