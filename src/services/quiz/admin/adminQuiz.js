import { api } from 'src/boot/axios';
// 관리자용

// [문제 생성]
export const submitQuiz = async quizData => {
  try {
    // 문제 데이터 서버에 제출
    const response = await api.post('/api/v2/quiz/default', quizData);
    return response.data; // 서버에서 받은 문제 ID 반환
  } catch (error) {
    throw error;
  }
};
// 이미지 전송 로직
// 1.  이미지 임시추가
export const submitQuizImageTemp = async base64String => {
  try {
    const imageData = {
      base64String,
    };
    const response = await api.post('/api/v2/quiz/image/temp', imageData);
    const uuid = response.data;
    console.log('이미지 임시 추가 완료 uuid: ', uuid);
    return uuid; //UUID 반환
  } catch (error) {
    alert('이미지 추가가 안됩니다.');
    throw error;
  }
};
// 2. 이미지 추가.
export const submitQuizImage = async (quizId, uuid) => {
  try {
    const imageData = {
      uuid,
      quizId,
    };
    console.log('imageData ', imageData);
    await api.post('/api/v2/quiz/image', imageData);
    console.log('이미지 추가 완료');
  } catch (error) {
    throw error;
  }
};

// [문제 삭제]
export const deleteQuiz = async quizId => {
  try {
    await api.delete(`/api/v2/quiz/${quizId}`);
  } catch (error) {
    throw error;
  }
};

// [문제 조회 : 관리자용 문제]
export const fetchQuizzesFromApi = async () => {
  try {
    const response = await api.get('/api/v2/quiz/default', {
      params: {
        page: 0,
        size: 1000,
      },
    });
    return response.data.content; // 퀴즈 목록 데이터 반환
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error; // 에러 발생 시 호출한 곳에서 처리할 수 있도록 에러를 던짐
  }
};
