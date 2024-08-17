import axios from 'axios';

const API_URL = 'http://localhost:8085/api';

export const checkUsername = async (username) => {
    const response = await axios.get(`${API_URL}/check-username`, { params: { username } });
    return response.data;
};

export const checkEmail = async (email) => {
    const response = await axios.get(`${API_URL}/check-email`, { params: { email } });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/signin`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// steps 추가
export const getStepsByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/steps/${userId}`);
    return response.data;
};

// 월간 steps 추가
export const getMonthlyStepsByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/steps/monthly/${userId}`);
    return response.data;
};

// 전주 걸음
export const getPreviousWeekStepsByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/steps/previousWeek/${userId}`);
    return response.data;
};

// 관리자 - 회원 전체 정보
export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
};

export const fetchDeactivationStatistics = async () => {
    try {
        const response = await axios.get(`${API_URL}/deactivation-stats`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch deactivation statistics:', error);
        throw error;
    }
};
