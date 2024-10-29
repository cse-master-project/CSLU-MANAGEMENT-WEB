import { api } from 'src/boot/axios';

//폐기
export const quizDeleteApi = async quizId => {
  try {
    await api.delete(`/api/v2/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};

//수정
export const quizPactchApi = async (quizId, quizData) => {
  try {
    await api.patch(`/api/v2/quiz/${quizId}`, quizData);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};

//반려
export const quizRejecthApi = async (quizId, reason) => {
  try {
    await api.put(`/api/v2/quiz/${quizId}/reject`, reason);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};

//승인
export const quizApproveApi = async quizId => {
  try {
    await api.put(`/api/v2/quiz/${quizId}/approve`);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};
