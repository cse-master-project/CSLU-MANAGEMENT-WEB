import { api } from 'src/boot/axios';
// 관리자용

// [문제 조회 : 승인된 사용자용 문제]
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
};
