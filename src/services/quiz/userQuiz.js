import { userApi } from 'src/boot/userAxios';

// 제출자 문제 생성시 서버에 보내는 api
export const submitQuiz = async quizData => {
  try {
    // 문제 데이터 서버에 제출
    const response = await userApi.post('/api/v2/quiz/user', quizData);
    return response.data; // 서버에서 받은 문제 ID 반환
  } catch (error) {
    throw error;
  }
};
// 이미지가 있을시 이미지 추가.
export const submitQuizImage = async (quizId, base64String) => {
  try {
    const imageData = {
      base64String,
      quizId,
    };
    await userApi.post('/api/v2/quiz/image', imageData);
    //console.log('이미지 추가 완료');
  } catch (error) {
    throw error;
  }
};
// 이미지추가 실패시, 퀴즈삭제
export const deleteQuiz = async quizId => {
  try {
    await userApi.delete(`/api/management/quiz/${quizId}`);
  } catch (error) {
    throw error;
  }
};

// 제출자 목록 조회시 서버에 보내는 api
export const fetchQuizzesFromApi = async () => {
  try {
    const response = await userApi.get('/api/v2/quiz/my');
    return response.data;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
