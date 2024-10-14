import { userApi } from 'src/boot/userAxios';

// 제출자용

// 퀴즈 상세 조회
export const fetchQuiz = async quizId => {
  try {
    const response = await userApi.get(`/api/v2/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error;
  }
};

// 퀴즈 이미지 상세 조회
export const fetchQuizImage = async quizId => {
  try {
    const response = await userApi.get(`/api/v2/quiz/${quizId}/image`);
    return response.data;
  } catch (error) {
    console.error('이미지 데이터를 불러오는 데 실패했습니다.', error);
    throw error;
  }
};

// 퀴즈 승인여부 조회
export const fetchQuizPermissionStatus = async quizId => {
  try {
    const response = await userApi.get('/api/v2/quiz/my');
    const quiz1 = response.data.content.find(item => item.quizId === quizId);
    return quiz1 ? quiz1.permissionStatus : '알 수 없음';
  } catch (error) {
    console.error('퀴즈 승인 상태를 불러오는 데 실패했습니다.', error);
    throw error;
  }
};

// 퀴즈 반려 사유 조회
export const fetchQuizRejectReasons = async quizId => {
  try {
    const response = await userApi.get('/api/v2/quiz/my/reject', {
      params: { quizId },
    });
    return response.data;
  } catch (error) {
    console.error('반려 이유를 불러오는 데 실패했습니다.', error);
    throw error;
  }
};
