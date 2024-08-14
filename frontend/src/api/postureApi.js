const API_URL = 'http://localhost:8081/api';

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

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
    return result.url;  // Flask에서 처리된 파일의 URL을 반환
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};
