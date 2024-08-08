<template>
  <q-card>
    <q-card-section>
      <q-p>과목 삭제</q-p>
      <q-select
        v-model="deleteSubject"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md"
      />
      <q-btn @click="submitDeleteSubject">과목 삭제</q-btn>
    </q-card-section>
    <q-card-section>
      <q-p>챕터 삭제</q-p>
      <q-select
        v-model="atSubject3"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md"
        @update:model-value="updateDetailSubjectOptions"
      />
      <q-select
        v-model="DeleteDetailSubject"
        :options="filteredDetailSubjectOptions"
        label="챕터"
        outlined
        class="q-mb-md"
      />
      <q-btn @click="submitDeleteDetailSubject">챕터 삭제</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import useCategories from 'src/services/useCategories.js';

//카테고리 조회 기능
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const filteredDetailSubjectOptions = ref([]);

//과목 삭제 기능
const deleteSubject = ref('');
const submitDeleteSubject = async () => {
  // 요청 본문에 포함될 데이터 객체
  const subjectDeleteData = {
    data: {
      subject: deleteSubject.value,
    },
  };
  try {
    console.log(subjectDeleteData);
    await api.delete('api/quiz/subject', subjectDeleteData);
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
    alert('과목이 삭제되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('과목 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};
//챕터 삭제 기능
const atSubject3 = ref('');
const DeleteDetailSubject = ref('');
const submitDeleteDetailSubject = async () => {
  const subjectDeleteData = {
    data: {
      subject: atSubject3.value,
      detailSubject: DeleteDetailSubject.value,
    },
  };
  try {
    console.log(subjectDeleteData);
    await api.delete('api/quiz/subject/detail', subjectDeleteData);
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
    alert('챕터가 삭제되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('챕터 삭제 중 예상치 못한 오류가 발생했습니다.');
  }
};
const updateDetailSubjectOptions = () => {
  // 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    atSubject3.value,
  );
};
watch(atSubject3, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  DeleteDetailSubject.value = '';
  updateDetailSubjectOptions();
});

onMounted(fetchCategories);
</script>
