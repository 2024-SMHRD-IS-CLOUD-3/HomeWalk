import React, { useEffect, useState } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Divider, Grid } from '@mui/material';
import { getJoinRequestsForCreator } from '../../api/family';
import { useAuth } from '../../context/AuthContext';

const FamilyRequests = () => {
  const { userId } = useAuth(); // 현재 로그인한 사용자의 ID
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const requests = await getJoinRequestsForCreator(userId);
        console.log('requests', requests);
        setJoinRequests(requests);
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
    };

    if (userId) {
      fetchJoinRequests();
    }
  }, [userId]);

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          가입 신청 목록
        </Typography>
        <List>
          {joinRequests.map((request) => (
            <React.Fragment key={request.id}>
              <ListItem>
                <ListItemText
                  primary={`사용자: ${request.username}`}
                  secondary={`신청 날짜: ${request.requestDate}, 승인 상태: ${request.approved ? '승인됨' : '대기 중'}`}
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

export default FamilyRequests;
