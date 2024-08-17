import axios from 'axios';

const API_URL = 'http://localhost:8085/api';

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

