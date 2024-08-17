import axios from 'axios';

// 게시글에 좋아요를 추가하거나 취소하는 함수
export const toggleLike = async (userId, postId) => {
  try {
    // userId와 postId를 포함한 객체를 POST 요청으로 전송
    const response = await axios.post('/api/likes/toggle', { userId, postId });
    return response.data; // 좋아요 상태(true: 추가됨, false: 취소됨)를 반환
  } catch (error) {
    console.error(`Error toggling like for post ID ${postId}:`, error);
    throw error;
  }
};

// 게시글의 좋아요 수를 가져오는 함수
export const getLikeCount = async (postId) => {
  try {
    // GET 요청으로 특정 게시물의 좋아요 수를 가져옴
    const response = await axios.get(`/api/likes/count/${postId}`);
    return response.data; // 좋아요 수를 반환
  } catch (error) {
    console.error(`Error fetching like count for post ID ${postId}:`, error);
    throw error;
  }
};

// 사용자가 좋아요를 누른 게시물 목록을 가져오는 함수
export const getLikedPosts = async (userId) => {
  try {
    // GET 요청으로 사용자가 좋아요한 게시물의 ID 리스트를 가져옴
    const response = await axios.get(`/api/likes/user/${userId}`);
    return response.data; // 사용자가 좋아요한 게시물의 ID 배열을 반환
  } catch (error) {
    console.error(`Error fetching liked posts for user ID ${userId}:`, error);
    throw error;
  }
};
