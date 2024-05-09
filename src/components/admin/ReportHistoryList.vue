<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">신고 내역</div>
    </q-card-section>
    <q-card-section>
      <q-list bordered class="rounded-borders">
        <q-item
          v-for="(report, index) in reports"
          :key="index"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label>{{ report.title }}</q-item-label>
            <q-item-label caption>{{ report.date }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn flat icon="edit" @click="editReport(report)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

// 예시 데이터, 실제 애플리케이션에서는 API 호출을 통해 데이터를 가져올 수 있습니다.
const reports = ref([
  { title: '부적절한 내용 신고', date: '2024-05-01' },
  { title: '저작권 침해 신고', date: '2024-05-02' },
  // 추가 신고 내역 ...
]);

// 신고 항목을 편집하는 함수
function editReport(report) {
  console.log('편집할 신고: ', report);
  // 신고 편집 로직 구현
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
