import { api } from 'src/boot/axios';
// 관리자용

// [문제 조회 : 신고된 문제]
export const fetchQuizzesFromApi = async () => {
  try {
    const response = await api.get('/api/v2/quiz/report', {
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

// [신고된 사유 조회 : 신고된 문제]
export const fetchReoportsFromApi = async quizId => {
  try {
    const response = await api.get(`/api/v2/quiz/${quizId}/report`);
    return response.data.content;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

// [신고 처리]
export const statusReportsFromApi = async quizReportId => {
  try {
    console.log(quizReportId);
    const response = await api.patch(
      `/api/v2/quiz/report/${quizReportId}/status`,
      null, // 요청 본문이 없을 경우 null 설정
      { params: { status: 1 } }, // params는 세 번째 인수로 전달
    );
    console.log('상태 업데이트 응답:', response.data);
  } catch (error) {
    console.error('퀴즈 신고 처리에 실패했습니다.', error);
  }
};
