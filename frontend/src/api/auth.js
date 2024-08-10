import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/signin`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;  // 응답 데이터를 반환
};
