import axios from 'axios';

const API_URL = 'http://localhost:8081/api'; // 실제 API URL을 넣으세요

// 특정 사용자들의 주간 목표 데이터를 가져오는 API 호출 함수
export const getWeeklyFamilyGoals = async (userIds) => {
    try {
        const response = await axios.post(`${API_URL}/goals/weekly`, { userIds });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly family goals:', error);
        throw error;
    }
};
