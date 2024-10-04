<template>
  <q-card class="custom-card">
    <q-card-section class="card-section">
      <q-p class="section-title">과목 삭제</q-p>
      <q-select
        v-model="deleteSubject"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md select-box"
      />
      <q-btn @click="submitDeleteSubject" class="submit-btn">과목 삭제</q-btn>
    </q-card-section>
    <q-card-section class="card-section">
      <q-p class="section-title">챕터 삭제</q-p>
      <q-select
        v-model="atSubject3"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md select-box"
        @update:model-value="updateDetailSubjectOptions"
      />
      <q-select
        v-model="deleteDetailSubject"
        :options="filteredDetailSubjectOptions"
        label="챕터"
        outlined
        class="q-mb-md select-box"
      />
      <q-btn @click="submitDeleteDetailSubject" class="submit-btn"
        >챕터 삭제</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import useCategories from 'src/services/useCategories.js';

// 카테고리 조회 기능
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const filteredDetailSubjectOptions = ref([]);

// 과목 삭제 기능
const deleteSubject = ref('');
const submitDeleteSubject = async () => {
  try {
    await api.delete('api/quiz/subject', {
      data: {
        subject: deleteSubject.value,
      },
    });
    alert('과목이 삭제되었습니다.');
    deleteSubject.value = ''; // 삭제 후 입력 필드 초기화
  } catch (error) {
    console.error('에러 :', error);
    alert('과목 삭제 중 예상치 못한 오류가 발생했습니다.');
  }
};

// 챕터 삭제 기능
const atSubject3 = ref('');
const deleteDetailSubject = ref('');
const submitDeleteDetailSubject = async () => {
  try {
    await api.delete('api/quiz/subject/detail', {
      data: {
        subject: atSubject3.value,
        detailSubject: deleteDetailSubject.value,
      },
    });
    alert('챕터가 삭제되었습니다.');
    deleteDetailSubject.value = ''; // 삭제 후 입력 필드 초기화
  } catch (error) {
    console.error('에러 :', error);
    alert('챕터 삭제 중 예상치 못한 오류가 발생했습니다.');
  }
};

// 소분류 옵션 업데이트
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    atSubject3.value,
  );
};

watch(atSubject3, () => {
  deleteDetailSubject.value = '';
  updateDetailSubjectOptions();
});

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
