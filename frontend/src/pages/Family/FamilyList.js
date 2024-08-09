import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, List, ListItem, ListItemText, Divider, Grid, Box } from '@mui/material';
import { getFamilies } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const FamilyList = () => {
  const { userId } = useAuth();
  const [families, setFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const fetchedFamilies = await getFamilies(userId);
      const filteredFamilies = fetchedFamilies.filter(family => String(family.creatorId) !== String(userId));
      setFamilies(filteredFamilies);
    } catch (error) {
      console.error('Error fetching families:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFamilies = families.filter(family =>
    family.familyName && family.familyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid item xs={12}>
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
                  secondary={
                    <>
                      <Box component="span" fontWeight="fontWeightBold">
                        만든이: {family.creatorName}
                      </Box>
                      <br />
                      인원수: {family.memberCount || 1}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Grid>
  );
};

export default FamilyList;
