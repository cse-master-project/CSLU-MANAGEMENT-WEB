import { ref } from 'vue';
import { api } from 'src/boot/axios';

export function useCategorie() {
  const subjectOptions = ref([]); // 전체 과목 목록
  const selectedSubject = ref(''); // 선택된 과목
  const chapterOptions = ref([]); // 선택된 과목의 챕터 목록

  // 1. 전체 과목 목록 조회
  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/v2/quiz/subject');
      subjectOptions.value = response.data;
      console.log('과목 목록:', subjectOptions.value);
    } catch (error) {
      console.error('과목 목록을 불러오는 중 오류가 발생했습니다:', error);
    }
  };

  // 2. 특정 과목의 챕터 조회
  const fetchChapters = async subject => {
    try {
      const response = await api.get('/api/v2/quiz/subject/chapter', {
        params: { subject: subject }, // subject 파라미터 전달
      });
      chapterOptions.value = response.data.chapters || [];
      console.log('챕터 목록:', chapterOptions.value);
    } catch (error) {
      console.error('챕터 목록을 불러오는 중 오류가 발생했습니다:', error);
    }
  };

  // 과목 선택 시 챕터 조회
  const selectSubject = subject => {
    selectedSubject.value = subject;
    fetchChapters(subject); // 선택된 과목으로 챕터 조회
  };

  return {
    subjectOptions,
    selectedSubject,
    chapterOptions,
    fetchSubjects,
    selectSubject,
  };
}
