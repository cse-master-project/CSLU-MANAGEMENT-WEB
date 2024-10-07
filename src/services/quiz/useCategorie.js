import { ref } from 'vue';
import { api } from 'src/boot/axios';

// [view] : 카테고리 조회
export function useCategorie() {
  const subjectOptions = ref([]); // 전체 과목 목록
  const selectedSubject = ref(''); // 선택된 과목
  const chapterOptions = ref([]); // 선택된 과목의 챕터 목록
  // 전체 과목 목록 조회
  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/v2/quiz/subject');
      subjectOptions.value = response.data;
      console.log('과목 목록:', subjectOptions.value);
    } catch (error) {
      console.error('과목 목록을 불러오는 중 오류가 발생했습니다:', error);
    }
  };
  // 특정 과목의 챕터 조회
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

// [add] : 카테고리 추가
export function useCategorieAdd() {
  // 과목 추가
  const addSubject = async subject => {
    try {
      const subjectData = { subject };
      await api.post('api/quiz/subject', subjectData);
      return { success: true };
    } catch (error) {
      console.error('Error adding subject:', error);
      return { success: false, error };
    }
  };
  // 챕터 추가
  const addChapter = async (atSubject, chapter) => {
    try {
      const detailSubjectData = {
        subject: atSubject,
        chapter,
      };
      await api.post('api/v2/quiz/subject/chapter', detailSubjectData);
      return { success: true };
    } catch (error) {
      console.error('Error adding chapter:', error);
      return { success: false, error };
    }
  };
  return { addSubject, addChapter };
}

// [delete] : 카테고리 삭제
export function useCategorieDelete() {
  const deleteSubject = async subject => {
    try {
      await api.delete('/api/quiz/subject', {
        data: { subject },
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting subject:', error);
      return { success: false, error };
    }
  };

  const deleteChapter = async (subject, chapter) => {
    try {
      await api.delete('/api/v2/quiz/subject/chapter', {
        data: { subject, chapter },
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting chapter:', error);
      return { success: false, error };
    }
  };

  return { deleteSubject, deleteChapter };
}
