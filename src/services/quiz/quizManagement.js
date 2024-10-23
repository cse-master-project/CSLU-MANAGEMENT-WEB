import { api } from 'src/boot/axios';

//폐기
export const quizDeleteApi = async quizId => {
  try {
    await api.delete(`/api/v2/management/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};

//수정

//반려

//승인
