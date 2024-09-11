<template>
  <q-page padding>
    <!-- Quiz Cards -->
    <div class="row q-col-gutter-md q-pt-md">
      <div
        v-for="report in reports"
        :key="report.quizReportId"
        class="col-12 col-md-6 q-my-md"
      >
        <q-card
          class="my-card"
          clickable
          v-ripple
          @click="goToQuizDetail(report.quizId)"
          style="cursor: pointer"
        >
          <q-card-section>
            <div class="text-h6">퀴즈 ID: {{ report.quizId }}</div>
            <div class="text-caption text-reportAt">
              신고일: {{ formatDate(report.reportAt) }}
            </div>
            <div class="text-subtitle2">신고 이유 : {{ report.content }}</div>
            <div class="text-caption text-userId">
              신고자 : {{ report.userNickname }}
            </div>
          </q-card-section>
        </q-card>
      </div>
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

<style scoped></style>
