import axios from "axios";

const API_URL = 'http://localhost:8085/api';

export const uploadVideo = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userid', userId); // 사용자 ID 추가

  try {
    // Spring Boot 백엔드로 파일 업로드 요청
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload the video. Status: ${response.status}`);
    }

    const result = await response.json();
    return result.url;  // 처리된 파일의 URL 반환
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const fetchScoreData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/scores`, {
      params: { userId: userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching score data:', error);
    throw error;
  }
};