import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filters', {
  state: () => ({
    subject: '',
    detailSubject: '',
    quizType: '',
  }),
  actions: {
    setSubject(subject) {
      this.subject = subject;
    },
    setDetailSubject(detailSubject) {
      this.detailSubject = detailSubject;
    },
    setQuizType(quizType) {
      this.quizType = quizType;
    },
  },
});
