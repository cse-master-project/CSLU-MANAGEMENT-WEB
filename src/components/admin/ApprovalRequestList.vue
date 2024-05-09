<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">승인 요청 목록</div>
    </q-card-section>
    <q-card-section>
      <q-list bordered separator>
        <q-item
          v-for="(request, index) in requests"
          :key="index"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label>{{ request.title }}</q-item-label>
            <q-item-label caption>{{ request.date }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn flat icon="edit" @click="editRequest(request)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

// 예시 데이터, 실제로는 API 호출 등을 통해 데이터를 불러와야 합니다.
const requests = ref([
  { title: '승인 요청 1', date: '2024-05-01' },
  { title: '승인 요청 2', date: '2024-05-02' },
  { title: '승인 요청 3', date: '2024-05-03' },
]);

// 승인 요청을 편집하는 메소드
function editRequest(request) {
  // 여기에 승인 요청을 편집하는 로직을 추가합니다.
  console.log('편집 요청:', request);
}
</script>

<style scoped>
/* 필요한 스타일을 여기에 정의합니다. */
</style>
