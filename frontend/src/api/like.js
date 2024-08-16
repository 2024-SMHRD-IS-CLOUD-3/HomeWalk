import axios from 'axios';

// 게시글에 좋아요를 추가하거나 취소하는 함수
export const toggleLike = async (userId, postId) => {
  try {
    const response = await axios.post('/api/likes/toggle', { userId, postId });
    return response.data;
  } catch (error) {
    console.error(`Error toggling like for post ID ${postId}:`, error);
    throw error;
  }
};

// 게시글의 좋아요 수를 가져오는 함수
export const getLikeCount = async (postId) => {
  try {
    const response = await axios.get(`/api/likes/count/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching like count for post ID ${postId}:`, error);
    throw error;
  }
};
