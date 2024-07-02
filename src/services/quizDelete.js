// quizDelete.js

import { api } from 'src/boot/axios';
import { ref } from 'vue';

export const deleteQuizSuccess = ref(false);

export const quizDelete = async quizId => {
  try {
    await api.delete(`/api/management/quiz/${quizId}`);
    deleteQuizSuccess.value = true;
  } catch (error) {
    console.error('퀴즈 삭제에 실패했습니다.', error);
    alert('문제 폐기 중 예상치 못한 오류가 발생했습니다.');
  }
};
