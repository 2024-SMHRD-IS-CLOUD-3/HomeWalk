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

export const sendResetPasswordEmail = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
        return response.data;
    } catch (error) {
        console.error('Error sending reset password email:', error);
        return { success: false, error: error.message };
    }
};

export const resetPassword = async (token, newPassword) => {
    const response = await axios.post(`${API_URL}/auth/reset-password/confirm`, { token, newPassword });
    return response.data; // 성공 여부에 따라 적절한 데이터를 반환
};