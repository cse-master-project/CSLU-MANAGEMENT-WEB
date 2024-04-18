<template>
  <q-page class="q-page-custom">
    <div class="column justify-start">
      <div class="q-mb-md">
        <q-card class="card-custom" flat>
          <div class="centered-img-container">
            <!-- <q-img src="/public/creative_ideas.jpg" class="q-img-fixed-size" /> -->
          </div>
          <q-card-section>
            <div class="text-h6">창의력을 발휘하고, 지식을 나누어 보세요.</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <p>
              당신만의 독창적인 문제를 만들어 전 세계 사람들과 지식을 공유할 수
              있는 기회입니다. 당신의 아이디어가 새로운 학습의 씨앗이 됩니다.
            </p>
          </q-card-section>
        </q-card>
      </div>

      <div>
        <q-card class="card-custom" flat>
          <div class="centered-img-container">
            <!-- <q-img src="/public/global_learning.jpg" class="q-img-fixed-size" /> -->
          </div>
          <q-card-section>
            <div class="text-h6">당신의 지식이 전 세계의 학습을 이끕니다.</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <p>
              웹 플랫폼에서 직접 문제를 제작하고, 우리의 전문가 팀이 이를
              검토합니다. 승인된 문제들은 앱을 통해 전 세계 수많은 사용자들에게
              도달, 모두가 당신의 지식으로부터 배울 수 있습니다.
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup></script>

<style>
.q-page-custom {
  padding: 16px;
}

.card-custom {
  height: 90vh;
  overflow-y: auto;
  scrollbar-width: none; /* 파이어폭스에서 스크롤바를 숨김 */
}

.card-custom::-webkit-scrollbar {
  display: none; /* 웹킷 기반 브라우저에서 스크롤바를 숨김 */
}

.q-img-fixed-size {
  max-width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.centered-img-container {
  display: flex;
  justify-content: center;
}
</style>
