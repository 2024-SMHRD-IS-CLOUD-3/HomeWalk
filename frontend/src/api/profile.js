import axios from 'axios';

// 사용자 정보를 가져오는 함수
export const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data', error);
        throw error;
    }
};

export const updateUserProfile = async (token, updatedUserData) => {
    try {
        const response = await axios.put('/api/user', updatedUserData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update user profile', error);
        throw error;
    }
};

// 사용자 프로필 이미지 업로드 함수
export const uploadProfileImage = async (token, formData) => {
  try {
    const response = await axios.post('/api/upload-avatar', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // 서버에서 반환한 이미지 경로
  } catch (error) {
    console.error('Failed to upload profile image', error);
    throw error;
  }
};

// 사용자 프로필 이미지 가져오는 함수 추가
export const fetchUserAvatar = async (userId) => {
    try {
        const response = await axios.get(`/api/profile/${userId}/avatar`);
        return response.data; // 이미지 경로 반환
    } catch (error) {
        console.error('Failed to fetch user avatar', error);
        throw error;
    }
};
