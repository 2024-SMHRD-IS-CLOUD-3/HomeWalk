import axios from 'axios';

const API_URL = 'http://localhost:8085/api';

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

export const uploadKakaoProfileImage = async (token, imageUrl) => {
    try {
        const response = await axios.post('http://localhost:8085/api/upload-kakao-avatar', null, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                imageUrl: imageUrl, // 카카오에서 받은 이미지 URL
            },
        });
        return response.data; // 저장된 파일 경로를 반환
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error; // 필요에 따라 에러를 다시 던집니다.
    }
};