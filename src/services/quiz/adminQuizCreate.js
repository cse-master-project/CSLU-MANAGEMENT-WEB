import { api } from 'src/boot/axios';

// 관리자 문제 서버에 보내는 api
export const submitQuiz = async quizData => {
  try {
    // 문제 데이터 서버에 제출
    const response = await api.post('/api/v2/quiz/default', quizData);
    return response.data; // 서버에서 받은 문제 ID 반환
  } catch (error) {
    throw error;
  }
};

export const submitQuizImage = async (quizId, base64String) => {
  try {
    const imageData = {
      base64String,
      quizId,
    };
    await api.post('/api/v2/quiz/image', imageData);
    console.log('이미지 추가 완료');
  } catch (error) {
    throw error;
  }
};

export const deleteQuiz = async quizId => {
  try {
    await api.delete(`/api/management/quiz/${quizId}`);
  } catch (error) {
    throw error;
  }
};
