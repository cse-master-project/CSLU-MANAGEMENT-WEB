<template>
  <q-page class="page">
    <q-card class="privacy-card">
      <q-card-section class="image-section">
        <img src="/public/auth1.png" alt="Privacy Policy Image 1" />
      </q-card-section>
      <q-card-section class="image-section">
        <img src="/public/auth2.png" alt="Privacy Policy Image 2" />
      </q-card-section>
      <q-card-section class="image-section">
        <img src="/public/auth3.png" alt="Privacy Policy Image 3" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup></script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
}

.privacy-card {
  width: 100%;
  max-width: 800px;
  overflow-y: auto;
}

.image-section {
  text-align: center;
  padding: 16px;
}

.image-section img {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.q-card-section + .q-card-section {
  margin-top: 16px;
}
</style>
