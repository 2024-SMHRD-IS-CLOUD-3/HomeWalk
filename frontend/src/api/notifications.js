import axios from 'axios';

// 알림 생성 API 호출 함수
export const createNotification = async (userId, message) => {
    try {
        const response = await axios.post('/api/notifications', {
            userId,
            message,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// 읽지 않은 알림을 가져오는 API 호출 함수
export const getUnreadNotifications = async (userId) => {
    try {
        const response = await axios.get(`/api/notifications/${userId}`);
        return response.data; // 알림 데이터 반환
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};

// 알림을 읽음 처리하는 API 호출 함수
export const markNotificationAsRead = async (notificationId) => {
    try {
        await axios.put(`/api/notifications/${notificationId}/read`);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};