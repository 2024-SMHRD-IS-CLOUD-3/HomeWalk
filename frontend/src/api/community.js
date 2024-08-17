import axios from 'axios';

const API_URL = 'http://localhost:8085/api/posts';  // API 경로 수정

// 게시글 데이터를 가져오는 함수
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);  // 모든 게시글을 가져오는 경로
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// 게시글에 좋아요를 토글하는 함수
export const toggleLike = async (postId, userId) => {
    try {
      const response = await axios.post(`${API_URL}/likes/toggle`, null, {
        params: { postId, userId }
      });
      return response.data; // true면 좋아요가 추가됨, false면 좋아요가 취소됨
    } catch (error) {
      console.error(`Error toggling like for post with ID ${postId}:`, error);
      throw error;
    }
  };

// 사용자가 좋아요를 누른 게시물 ID를 가져오는 함수
export const getLikedPosts = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/likes/user/${userId}`);
      return response.data; // 사용자가 좋아요한 게시물 ID 배열
    } catch (error) {
      console.error(`Error fetching liked posts for user with ID ${userId}:`, error);
      throw error;
    }
  };

// 게시글에 좋아요를 추가하는 함수
export const likePost = async (postId) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/like`);  // 게시글에 좋아요를 추가하는 경로
    return response.data;
  } catch (error) {
    console.error(`Error liking post with ID ${postId}:`, error);
    throw error;
  }
};

// 게시글에 댓글을 추가하는 함수
export const addComment = async (postId, comment) => {
  try {
    const response = await axios.post(`${API_URL}/${postId}/comment`, null, {
      params: { comment }
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to post with ID ${postId}:`, error);
    throw error;
  }
};

// 게시글을 작성하는 함수
export const createPost = async (userId, title, content, imageFile) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  if (imageFile) {
    formData.append('file', imageFile);
  }

  try {
    const response = await axios.post(`${API_URL}/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};
