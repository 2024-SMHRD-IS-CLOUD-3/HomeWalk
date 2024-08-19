import axios from 'axios';

const API_URL = 'http://192.168.219.55:8085/api';

export const fetchCurrentChallenges = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/challenges/current`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current challenges', error);
    throw error;
  }
};

export const fetchAvailableChallenges = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/challenges/available`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch available challenges', error);
    throw error;
  }
};

// 완료된 챌린지 목록 가져오기
export const fetchCompletedChallenges = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/challenges/completed`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch completed challenges', error);
    throw error;
  }
};

export const createChallenge = async (challengeData) => {
  try {
    const response = await axios.post(`${API_URL}/challenges`, challengeData);
    return response.data;
  } catch (error) {
    console.error('Failed to create challenge', error);
    throw error;
  }
};

export const joinChallenge = async (challengeId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/challenges/${challengeId}/join`, null, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to join challenge', error);
    throw error;
  }
};

// 여기서 추가
export const leaveChallenge = async (challengeId, userId) => {
  try {
    const response = await axios.delete(`${API_URL}/challenges/${challengeId}/leave`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to leave challenge', error);
    throw error;
  }
};

export const updateChallengeAchievement = async (challengeId, userId, achieved) => {
  try {
    const response = await axios.patch(`${API_URL}/challenges/${challengeId}/achievement`, 
    { achieved },  // Body에 JSON 객체로 achieved 값 전달
    {
      params: { userId }, // 쿼리 파라미터로 userId 전달
      headers: {
        'Content-Type': 'application/json'  // Content-Type을 JSON으로 설정
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update challenge achievement', error);
    throw error;
  }
};

export const deleteChallengeAPI = async (challengeId) => {
  try {
    const response = await axios.delete(`${API_URL}/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete challenge', error);
    throw error;
  }
};


