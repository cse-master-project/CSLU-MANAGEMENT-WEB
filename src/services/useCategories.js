import { ref } from 'vue';
import { api } from 'src/boot/axios';

// 카테고리 사용하기. (view:조회)
export default function useCategories() {
  const categories = ref([]);
  const subjectOptions = ref([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/quiz/subject');
      categories.value = response.data;
      // console.log(categories.value);
      subjectOptions.value = categories.value.map(category => category.subject);
    } catch (error) {
      console.error('카테고리를 불러오는 중 오류가 발생했습니다:', error);
    }
  };
  // 대분류에 따른 소분류 필터링 함수
  const getDetailSubjectsBySubject = selectedSubject => {
    const selectedCategory = categories.value.find(
      category => category.subject === selectedSubject,
    );
    return selectedCategory ? selectedCategory.detailSubject : [];
  };

  return {
    categories,
    subjectOptions,
    fetchCategories,
    getDetailSubjectsBySubject,
  };
}

// 과목, 챕터 관리 서비스
export const chapterManagement = {
  // - 추가
  //과목
  addSubject() {
    return api.post('api/v2/quiz/subject', subjectData);
  },
  //챕터
  addChapter() {
    return api.post('api/quiz/subject/chapter', chapterData);
  },

  // - 수정
  //과목
  editSubject() {
    return api.patch('api/v2/quiz/subject', subjectData);
  },
  //챕터
  editChapter() {
    return api.patch('api/quiz/subject/chapter', chapterData);
  },

  // - 삭제
  //과목
  addSubject() {
    return api.delete('api/v2/quiz/subject', subjectData);
  },
  //챕터
  addChapter() {
    return api.delete('api/quiz/subject/chapter', chapterData);
  },
};
