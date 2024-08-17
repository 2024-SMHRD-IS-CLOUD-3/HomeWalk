import axios from 'axios';

// 기본 API URL을 설정합니다.
const API_URL = 'http://localhost:8085/api'; // Spring Boot 서버의 기본 URL을 설정하세요.

// 모든 챌린지 가져오기
export const fetchChallenges = async () => {
  try {
    const response = await axios.get(`${API_URL}/challenges`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch challenges', error);
    throw error;
  }
};

// 챌린지 생성하기
export const createChallenge = async (challengeData) => {
  try {
    const response = await axios.post(`${API_URL}/challenges`, challengeData);
    return response.data;
  } catch (error) {
    console.error('Failed to create challenge', error);
    throw error;
  }
};

// 특정 챌린지 가져오기
export const fetchChallengeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch challenge with id ${id}`, error);
    throw error;
  }
};

// 챌린지 삭제하기
export const deleteChallenge = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete challenge with id ${id}`, error);
    throw error;
  }
};

// 챌린지 업데이트하기
export const updateChallenge = async (id, challengeData) => {
  try {
    const response = await axios.put(`${API_URL}/challenges/${id}`, challengeData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update challenge with id ${id}`, error);
    throw error;
  }
};
