<template>
  <q-card class="custom-card">
    <q-card-section class="card-section">
      <q-p class="section-title">과목 추가</q-p>
      <q-input
        v-model="addSubject"
        type="textarea"
        autogrow
        outlined
        placeholder="과목을 입력해주세요."
        class="textbox"
      />
      <q-btn @click="submitSubject" class="submit-btn">과목 추가</q-btn>
    </q-card-section>
    <q-card-section class="card-section">
      <q-p class="section-title">챕터 추가</q-p>
      <q-select
        v-model="atSubject"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md select-box"
      />
      <q-input
        v-model="addDetailSubject"
        type="textarea"
        autogrow
        outlined
        placeholder="챕터를 입력해주세요."
        class="textbox"
      />
      <q-btn @click="submitDetailSubject" class="submit-btn">챕터 추가</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import useCategories from 'src/services/useCategories.js';

// 카테고리 조회 기능
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const atSubject = ref('');
const addSubject = ref('');
const addDetailSubject = ref('');

// 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    atSubject.value,
  );
};

// 과목 추가 기능
const submitSubject = async () => {
  const subjectData = {
    subject: addSubject.value,
  };
  try {
    await api.post('api/quiz/subject', subjectData);
    // 삭제 성공 시 로직
    addSubject.value = ''; // 입력 필드 초기화
    alert('과목이 추가되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('과목 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};

// 챕터 추가 기능
const submitDetailSubject = async () => {
  const detailSubjectData = {
    subject: atSubject.value,
    detailSubject: addDetailSubject.value,
    sortIndex: 0,
  };
  try {
    await api.post('api/quiz/subject/detail', detailSubjectData);
    addDetailSubject.value = ''; // 입력 필드 초기화
    alert('챕터가 추가되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('챕터 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
.custom-card {
  max-width: 650px; /* 카드의 최대 너비를 설정 */
  margin: auto; /* 카드의 좌우 여백을 자동으로 설정하여 중앙 정렬 */
  border-radius: 12px; /* 카드 모서리의 둥글기를 설정 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* 카드에 그림자 효과 추가 */
  background: #ffffff; /* 카드 배경 색상 설정 (흰색) */
}

.card-section {
  padding: 20px; /* 카드 섹션의 내부 여백 설정 */
  border-bottom: 1px solid #e0e0e0; /* 카드 섹션의 하단 테두리 추가 */
}

.section-title {
  font-size: 1.2rem; /* 섹션 제목 폰트 크기 설정 */
  font-weight: bold; /* 섹션 제목의 폰트 굵기 설정 */
  margin-bottom: 1rem; /* 제목과 입력 필드 간의 간격 설정 */
}

.textbox {
  margin: 10px 0; /* 입력 필드의 상하 여백 설정 */
  width: 100%; /* 입력 필드의 너비를 100%로 설정 */
}

.submit-btn {
  width: 100%; /* 버튼의 너비를 100%로 설정 */
  background-color: rgb(224, 224, 224); /* 버튼 배경색을 파란색으로 설정 */
  color: #030303; /* 버튼 텍스트 색상을 흰색으로 설정 */
  font-weight: bold; /* 버튼 텍스트 굵기 설정 */
  margin-top: 10px; /* 버튼 상단 여백 설정 */
}

.submit-btn:hover {
  background-color: #c6daee; /* 버튼에 마우스를 올렸을 때 배경색 변경 */
}

.select-box {
  width: 100%; /* 선택 박스의 너비를 100%로 설정 */
}
</style>
