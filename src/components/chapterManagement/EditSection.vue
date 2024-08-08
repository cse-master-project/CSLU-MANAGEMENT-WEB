<template>
  <q-card
    ><q-card-section>
      <q-p>과목 수정</q-p>
      <q-select
        v-model="atEditSubject"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md"
      />
      <q-input
        v-model="editSubject"
        type="textarea"
        autogrow
        outlined
        placeholder="수정 과목을 입력해주세요."
        class="textbox"
        style="margin: 3% 0; width: 30%"
      />
      <q-btn @click="submitEditSubject">과목 수정</q-btn>
    </q-card-section>
    <q-card-section>
      <q-p>챕터 수정</q-p>
      <q-select
        v-model="atSubject2"
        :options="subjectOptions"
        label="과목"
        outlined
        class="q-mb-md"
        @update:model-value="updateDetailSubjectOptions"
      />
      <q-select
        v-model="atEditDetailSubject"
        :options="filteredDetailSubjectOptions"
        label="챕터"
        outlined
        class="q-mb-md"
      />
      <q-input
        v-model="editDetailSubject"
        type="textarea"
        autogrow
        outlined
        placeholder="수정 챕터를 입력해주세요."
        class="textbox"
        style="margin: 3% 0; width: 30%"
      />
      <q-btn @click="submitEditDetailSubject">챕터 수정</q-btn>
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
const updateDetailSubjectOptions = () => {
  // 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    atSubject2.value,
  );
};

//과목 수정기능
const atEditSubject = ref('');
const editSubject = ref('');
const submitEditSubject = async () => {
  const EditSubjectData = {
    subject: atEditSubject.value,
    newSubject: editSubject.value,
    //sortIndex: 0,
  };
  console.log(EditSubjectData);
  try {
    await api.patch('api/quiz/subject', EditSubjectData);
    alert('과목이 수정되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('챕터 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};
//챕터 수정 기능
const atSubject2 = ref('');
const atEditDetailSubject = ref('');
const editDetailSubject = ref('');
const submitEditDetailSubject = async () => {
  const EditDetailSubjectData = {
    subject: atSubject2.value,
    detailSubject: atEditDetailSubject.value,
    newDetailSubject: editDetailSubject.value,
  };
  console.log(EditDetailSubjectData);
  try {
    await api.patch('api/quiz/subject/detail', EditDetailSubjectData);
    alert('챕터가 수정되었습니다.');
  } catch (error) {
    console.error('에러 :', error);
    alert('챕터 추가 중 예상치 못한 오류가 발생했습니다.');
  }
};
watch(atSubject2, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  atEditDetailSubject.value = '';
  updateDetailSubjectOptions();
});

onMounted(fetchCategories);
</script>
