import { userApi } from 'src/boot/userAxios';
// 제출자용 퀴즈

// [문제 생성]
export const submitQuiz = async quizData => {
  try {
    // 문제 데이터 서버에 제출
    const response = await userApi.post('/api/v2/quiz/user', quizData);
    return response.data; // 서버에서 받은 문제 ID 반환
  } catch (error) {
    throw error;
  }
};
// 이미지 전송 로직
//1.  이미지 임시추가
export const submitQuizImageTemp = async base64String => {
  try {
    const imageData = {
      base64String,
    };
    const response = await userApi.post('/api/v2/quiz/image/temp', imageData);
    const uuid = response.data;
    console.log('uuid', uuid);
    return uuid; //UUID 반환
  } catch (error) {
    alert('서버에 문제가 있어 이미지 추가가 안됩니다.');
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
    await userApi.post('/api/v2/quiz/image', imageData);
    console.log('이미지 추가 완료');
  } catch (error) {
    throw error;
  }
};

// [문제 조회]
export const fetchQuizzesFromApi = async () => {
  try {
    const response = await userApi.get('/api/v2/quiz/my', {
      params: {
        page: 0,
        size: 1000,
      },
    });
    return response.data.content;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
