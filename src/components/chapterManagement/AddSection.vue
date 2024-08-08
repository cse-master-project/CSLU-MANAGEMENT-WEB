<template>
  <q-card>
    <q-card-section>
      <q-p>과목 추가</q-p>
      <q-input
        v-model="addSubject"
        type="textarea"
        autogrow
        outlined
        placeholder="과목을 입력해주세요."
        class="textbox"
        style="margin: 3% 0; width: 30%"
      />
      <q-btn @click="submitSubject">과목 추가</q-btn>
    </q-card-section>
    <q-card-section>
      <q-p>챕터 추가</q-p>
      <q-select
        v-model="atSubject"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md"
        @update:model-value="updateDetailSubjectOptions"
      />
      <q-input
        v-model="addDetailSubject"
        type="textarea"
        autogrow
        outlined
        placeholder="챕터를 입력해주세요."
        class="textbox"
        style="margin: 3% 0; width: 30%"
      />
      <q-btn @click="submitDetailSubject">챕터 추가</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import useCategories from 'src/services/useCategories.js';

//카테고리 조회 기능
const subject = ref('');
const detailSubject = ref('');
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const filteredDetailSubjectOptions = ref([]);
const updateDetailSubjectOptions = () => {
  // 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

onMounted(fetchCategories);

//과목 추가 기능
const addSubject = ref('');
const submitSubject = async () => {
  const subjectData = {
    subject: addSubject.value,
  };
  try {
    await api.post('api/quiz/subject', subjectData);
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
    alert('과목이 추가되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('과목 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};
//챕터 추가 기능
const atSubject = ref('');
const addDetailSubject = ref('');
const submitDetailSubject = async () => {
  const detailSubjectData = {
    subject: atSubject.value,
    detailSubject: addDetailSubject.value,
    sortIndex: 0,
  };
  console.log(detailSubjectData);
  try {
    await api.post('api/quiz/subject/detail', detailSubjectData);
    alert('챕터가 추가되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('챕터 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};
</script>
