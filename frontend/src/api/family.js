import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// 가족 정보 관련 API
export const createFamily = async (userId, familyData) => {
    const response = await axios.post(`${API_URL}/families`, familyData, {
        params: { userId },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// 사용자와 관련된 가족 목록 가져오기 (가입 신청 상태 포함)
export const getFamilies = async (userId) => {
    const response = await axios.get(`${API_URL}/families`, {
        params: { userId },
    });
    return response.data;
};

// 가족 가입 신청
export const requestJoinFamily = async (userId, familyId) => {
    const response = await axios.post(`${API_URL}/join-requests`, {
        userId,
        familyId,
    });
    return response.data;
};

// 가족 가입 취소
export const cancelJoinRequest = async (userId, familyId) => {
    const response = await axios.delete(`${API_URL}/join-requests`, {
        params: { userId, familyId },
    });
    return response.data;
};

// 가족 가입 신청 확인
export const getJoinRequestsForCreator = async (creatorId) => {
    try {
      const response = await axios.get(`/api/join-requests/creator`, {
        params: { creatorId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching join requests:', error);
      throw error;
    }
  };
