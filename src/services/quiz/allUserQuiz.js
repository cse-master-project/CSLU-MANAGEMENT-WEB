import { api } from 'src/boot/axios';

// 승인된 제출자 문제 목록 조회시 서버에 보내는 api
export const fetchQuizzesFromApi = async () => {
  try {
    const response = await api.get('/api/v2/quiz/user', {
      params: {
        page: 0,
        size: 1000,
      },
    });
    return response.data.content;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
    throw error; // 호출하는 곳에서 오류를 처리할 수 있도록 예외를 던집니다.
  }
  ㄴ;
};
