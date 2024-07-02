<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <div v-for="quiz in quizzes" :key="quiz.quizId" class="q-mb-md">
          <q-card
            clickable
            v-ripple
            @click="goToQuizDetail(quiz.quizId)"
            class="my-card"
          >
            <q-card-section class="card-content">
              <div class="row justify-between">
                <div class="text-h6 text-subject">{{ quiz.subject }}</div>
                <div class="text-body2">
                  {{ formatQuizType(quiz.quizType) }}
                </div>
              </div>
              <div class="row justify-between">
                <div class="text-subtitle2">{{ quiz.detailSubject }}</div>
              </div>
              <div class="text-caption text-createAt">
                {{ formatDate(quiz.createAt) }}
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

const quizzes = ref([]);

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quiz/default');
    quizzes.value = response.data.content;
    console.log(quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

onMounted(fetchQuizzes);

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/quizzes/${quizId}`);
}

const formatQuizType = quizType => {
  switch (quizType) {
    case 1:
      return '4지선다형';
    case 2:
      return '단답형';
    case 3:
      return '선긋기형';
    case 4:
      return 'O/X형';
    case 5:
      return '빈칸 채우기형';
    default:
      return '알 수 없는 유형';
  }
};

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped>
.my-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 10px;
}

.text-subject {
  font-weight: bold;
  color: #ffa500; /* 주황색 */
}

.text-createAt {
  font-size: 0.75rem; /* 작은 글씨 */
  color: #888888; /* 회색 */
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
