import { ref } from 'vue';
import { api } from 'src/boot/axios';

const deleteQuizSuccess = ref(false);

const quizDelete = async currentQuiz => {
  try {
    await api.delete(`/api/management/quiz/${currentQuiz.quizId}`);
    deleteQuizSuccess.value = true; // 폐기 성공 시 표시할 다이얼로그
  } catch (error) {
    alert('문제 폐기 중 예상치 못한 오류가 발생했습니다.');
  }
};

export { deleteQuizSuccess, quizDelete };
