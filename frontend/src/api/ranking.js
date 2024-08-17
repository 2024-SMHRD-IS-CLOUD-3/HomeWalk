import axios from 'axios';

const API_URL = 'http://localhost:8085/api'; // 실제 API URL을 넣으세요

export const getRankingData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/ranking?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ranking data:', error);
        throw error;
    }
};