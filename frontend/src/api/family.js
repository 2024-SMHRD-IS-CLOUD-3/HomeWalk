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

export const getFamilies = async () => {
    const response = await axios.get(`${API_URL}/families`);
    return response.data;
};

export const requestJoinFamily = async (userId, familyId) => {
    const response = await axios.post(`${API_URL}/join-requests`, {
        userId,
        familyId,
    });
    return response.data;
};
