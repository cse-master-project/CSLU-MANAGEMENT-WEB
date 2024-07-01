import { ref } from 'vue';
import { api } from 'src/boot/axios';

export default function useCategories() {
  const categories = ref([]);
  const subjectOptions = ref([]);
  const detailSubjectOptions = ref([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/quiz/subject');
      categories.value = response.data;
      subjectOptions.value = categories.value.map(category => category.subject);
      detailSubjectOptions.value = categories.value.flatMap(
        category => category.detailSubject,
      );
    } catch (error) {
      console.error('카테고리를 불러오는 중 오류가 발생했습니다:', error);
    }
  };

  return { categories, subjectOptions, detailSubjectOptions, fetchCategories };
}
