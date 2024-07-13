<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-p>카테고리조회</q-p>
        <!-- 대분류 선택 -->
        <q-select
          v-model="subject"
          :options="subjectOptions"
          label="과목"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <!-- 소분류 선택 -->
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          label="챕터"
          outlined
          class="q-mb-md"
        />
      </q-card-section>
      <q-card-section>
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
      </q-card-section>
      <q-card-section>
        <q-card-section>
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
      </q-card-section>
      <q-card-section>
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
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
watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

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

//과목 삭제 기능
const deleteSubject = ref('');
const submitDeleteSubject = async () => {
  const subjectDeleteData = {
    subject: deleteSubject.value,
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
    subject: atSubject3.value,
    detailSubject: DeleteDetailSubject.value,
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

onMounted(fetchCategories);
</script>
