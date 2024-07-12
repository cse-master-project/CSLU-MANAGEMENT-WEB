<template>
  <q-page class="q-page-custom">
    <div class="column justify-center">
      <div class="q-mb-md">
        <q-card class="card-custom" flat>
          <q-card-section>
            <div class="text-h5">창의력을 발휘하고, 지식을 나누어 보세요.</div>
          </q-card-section>
          <q-separator />
          <q-card-section style="font-size: 15px">
            <p>
              우리의 서비스는 학습자들이 자신만의 독창적인 문제를 만들고 공유할
              수 있는 플랫폼입니다. 여러분은 이 서비스를 통해 자신의 창의력을
              발휘하고, 다른 이들과 지식을 나눌 수 있습니다.
            </p>
            <p>
              문제 제작 서비스를 통해 여러분은 자신의 학습 경험을 향상시키고,
              다른 이들의 학습에 기여할 수 있습니다. 또한, 다양한 문제를 풀며
              자신의 이해도를 확인하고, 커뮤니티와 지식을 공유함으로써 자신의
              전문성을 향상시킬 수 있습니다.
            </p> </q-card-section
          ><q-card-section>
            <div class="text-h5">매뉴얼</div>
          </q-card-section>
          <q-separator />
          <q-card-section style="font-size: 15px">
            <p>
              우리의 서비스는 학습자들이 자신만의 독창적인 문제를 만들고 공유할
              수 있는 플랫폼입니다. 여러분은 이 서비스를 통해 자신의 창의력을
              발휘하고, 다른 이들과 지식을 나눌 수 있습니다.
            </p>
            <p>
              문제 제작 서비스를 통해 여러분은 자신의 학습 경험을 향상시키고,
              다른 이들의 학습에 기여할 수 있습니다. 또한, 다양한 문제를 풀며
              자신의 이해도를 확인하고, 커뮤니티와 지식을 공유함으로써 자신의
              전문성을 향상시킬 수 있습니다.
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
  max-height: 500px;
  object-fit: cover;
}

.centered-img-container {
  display: flex;
  justify-content: center;
}
</style>
