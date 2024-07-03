<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <div
          v-for="report in reports"
          :key="report.quizReportId"
          class="q-mb-md"
        >
          <q-card
            clickable
            v-ripple
            @click="goToQuizDetail(report.quizId)"
            class="my-card"
          >
            <q-card-section class="card-content">
              <div class="row justify-between">
                <div class="text-h6">퀴즈 ID: {{ report.quizId }}</div>
                <div class="text-caption text-reportAt">
                  신고일: {{ formatDate(report.reportAt) }}
                </div>
              </div>
              <div class="row justify-between">
                <div class="text-subtitle2">
                  신고 이유 : {{ report.content }}
                </div>
              </div>
              <div class="text-caption text-userId">
                신고자 ID: {{ report.userId }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const reports = ref([]);

const fetchReports = async () => {
  try {
    const response = await api.get('/api/quiz/report');
    reports.value = response.data; // 서버로부터 받아온 데이터를 reports에 저장
    console.log('신고된 문제 :', reports.value);
  } catch (error) {
    console.error('퀴즈 신고 데이터를 불러오는데 실패했습니다.', error);
  }
};

onMounted(fetchReports); // 컴포넌트가 마운트되었을 때 데이터를 불러옴

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/ReportedQuizzes/${quizId}`);
}

function formatDate(dateStr) {
  return date.formatDate(dateStr, 'YYYY-MM-DD HH:mm:ss');
}
</script>

<style scoped>
.my-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.text-subtitle2 {
  font-weight: bold;
  color: #ffa500; /* 주황색 */
}

.card-content {
  padding: 10px;
}

.text-reportAt {
  font-size: 0.75rem; /* 작은 글씨 */
  color: #888888; /* 회색 */
}

.text-userId {
  font-size: 0.75rem; /* 작은 글씨 */
  color: #888888; /* 회색 */
}

.q-mb-md {
  margin-bottom: 16px;
}

.rounded-borders {
  border-radius: 8px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
