import React, { useEffect, useState } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Divider, Grid, Button } from '@mui/material';
import { getJoinRequestsForCreator } from '../../api/family';
import { useAuth } from '../../context/AuthContext';
import { approveJoinRequest } from '../../api/family';  // 승인 API 호출 추가

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

  const handleApprove = async (requestId, familyId, userId) => {
    try {
      await approveJoinRequest(requestId, familyId, userId); // 승인 API 호출

      // 상태를 즉시 업데이트하여 UI에 반영
      setJoinRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requestId === requestId ? { ...request, approved: true } : request
        )
      );
    } catch (error) {
      console.error('Error approving join request:', error);
    }
  };


  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          가입 신청 목록
        </Typography>
        <List>
          {joinRequests.map((request) => (
            <React.Fragment key={request.requestId}>
              <ListItem>
                <ListItemText
                  primary={`사용자: ${request.username}`}
                  secondary={`신청 날짜: ${request.requestDate}, 승인 상태: ${request.approved ? '승인됨' : '대기 중'}`}
                />
                {!request.approved && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(request.requestId, request.familyId, request.userId)}
                  >
                    승인
                  </Button>
                )}
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
