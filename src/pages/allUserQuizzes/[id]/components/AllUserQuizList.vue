<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <div v-for="quiz in quizzes" :key="quiz.quizId" class="q-mb-md">
          <q-card clickable v-ripple @click="goToQuizDetail(quiz.quizId)">
            <q-card-section>
              <div class="text-h6">{{ quiz.subject }}</div>
            </q-card-section>
            <q-card-section>
              <div class="text-subtitle2">{{ quiz.detailSubject }}</div>
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
import { useManagerStore } from 'src/stores/auth';

const quizzes = ref([]);

const managerStore = useManagerStore();
const accessToken = managerStore.accessToken;

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quiz/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    quizzes.value = response.data.content; // 서버로부터 받아온 데이터를 quizzes에 저장
    console.log(quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

onMounted(fetchQuizzes); // 컴포넌트가 마운트되었을 때 데이터를 불러옴

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/allUserQuizzes/${quizId}`);
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
