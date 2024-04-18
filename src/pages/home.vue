<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="row justify-center q-col-gutter-md" style="max-width: 1080px">
      <div class="col-12 col-md-8">
        <q-card flat class="q-pa-md text-center">
          <q-card-section>
            <div class="text-h5">경상국립대 컴공 신입생의 첫걸음</div>
            <div class="text-subtitle1">
              복습에서부터 성공까지, 당신을 안내합니다.
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pt-none">
            <p>
              신입생 여러분을 위한 최적의 복습 가이드를 제공합니다. 여러분의
              컴퓨터 공학 여정을 지원하며, 성공적인 학습 결과를 위한 모든 자료를
              한눈에 확인할 수 있습니다.
            </p>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <img src="/gnu.jpeg" class="full-width" alt="경상국립대 이미지" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
// 필요한 스크립트를 여기에 추가
</script>

<style>
.full-width {
  width: 100%;
  height: auto;
}

/* 반응형 디자인을 위한 추가 스타일 */
@media (max-width: 768px) {
  .q-card {
    margin-bottom: 20px;
  }
}
</style>
