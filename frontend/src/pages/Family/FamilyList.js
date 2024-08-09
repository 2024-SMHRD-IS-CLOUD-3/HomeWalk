import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, List, ListItem, ListItemText, Divider, Grid, Box, Button } from '@mui/material';
import { getFamilies, requestJoinFamily } from '../../api/family'; // requestJoinFamily 함수는 가입 신청을 처리하는 API 호출
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

  const handleJoinRequest = async (familyId) => {
    try {
      await requestJoinFamily(userId, familyId); // 가입 신청 API 호출
      alert('가입 신청이 완료되었습니다.');
    } catch (error) {
      console.error('Error requesting to join family:', error);
      alert('가입 신청 중 오류가 발생했습니다.');
    }
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
                <Button
                  variant="contained"
                  onClick={() => handleJoinRequest(family.familyId)}
                  sx={{ ml: 2 }}
                >
                  가입
                </Button>
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
