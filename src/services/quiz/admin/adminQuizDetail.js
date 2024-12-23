import { api } from 'src/boot/axios';
// 관리자용 퀴즈

// [퀴즈 상세 조회]
export const fetchQuiz = async quizId => {
  try {
    const response = await api.get(`/api/v2/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};
// [퀴즈 이미지 상세 조회]
export const fetchQuizImage = async quizId => {
  try {
    const response = await api.get(`/api/v2/quiz/${quizId}/image`);
    return response.data;
  } catch (error) {
    console.error('이미지 데이터를 불러오는 데 실패했습니다.', error);
    throw error;
  }
};
