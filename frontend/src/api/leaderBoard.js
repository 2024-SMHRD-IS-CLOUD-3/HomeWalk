import axios from 'axios';

const API_URL = 'http://localhost:8081/api'; // 실제 API URL을 넣으세요

// 리더보드 업데이트 함수
export const updateLeaderboard = async () => {
    try {
        const response = await axios.post(`${API_URL}/leaderboard/update`);
        return response.data;
    } catch (error) {
        console.error('Error updating leaderboard:', error);
        throw error;
    }
};

// 리더보드 데이터를 가져오는 함수
export const getLeaderboardData = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/leaderboard`, {
            params: { userId } // 쿼리 파라미터로 userId 전달
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw error;
    }
};
