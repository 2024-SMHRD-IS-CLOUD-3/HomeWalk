import React from 'react';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';

const ChallengeModal = ({ challengeOpen, handleClose, newChallenge, handleNewChallenge, submitNewChallenge }) => (
  <Modal
    open={challengeOpen}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}>
      <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
        새로운 챌린지 생성
      </Typography>
      <TextField
        fullWidth
        label="챌린지 이름"
        name="name"
        value={newChallenge.name}
        onChange={handleNewChallenge}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="내용"
        name="content"
        value={newChallenge.content}
        onChange={handleNewChallenge}
        margin="normal"
        multiline
        rows={4}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="시작 날짜"
        name="startDate"
        type="date"
        value={newChallenge.startDate}
        onChange={handleNewChallenge}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="종료 날짜"
        name="endDate"
        type="date"
        value={newChallenge.endDate}
        onChange={handleNewChallenge}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        variant="outlined"
      />
      <Button onClick={submitNewChallenge} variant="contained" sx={{ mt: 2 }}>
        챌린지 생성
      </Button>
    </Box>
  </Modal>
);

export default ChallengeModal;
