import { ref } from 'vue';
import { userApi } from 'src/boot/userAxios';

export default function userUseCategories() {
  const categories = ref([]);
  const subjectOptions = ref([]);

  const fetchCategories = async () => {
    try {
      const response = await userApi.get('/api/quiz/subject');
      categories.value = response.data;
      //console.log(categories.value);
      subjectOptions.value = categories.value.map(category => ({
        value: category.subject,
        label: category.subject,
      }));
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
