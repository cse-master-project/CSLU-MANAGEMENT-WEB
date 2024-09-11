<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;빈칸채우기형&gt;
      </q-chip>
    </div>
    <q-card flat bordered>
      <q-card-section class="bg-primary text-white q-pa-md">
        <div class="text-subtitle1">Q. {{ quizcontent.quiz }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-weight-medium">
          정답 :
          <span class="text-positive">{{ quizcontent.answer.join(', ') }}</span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-weight-medium">
          해설 : <q-markdown>{{ quizcontent.commentary }}</q-markdown>
        </div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
defineProps({
  quizcontent: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.text-caption {
  font-size: 12px;
}

.text-weight-medium {
  font-weight: 500;
}
</style>
