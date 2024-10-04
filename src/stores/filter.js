import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filters', {
  state: () => ({
    subject: '',
    chapter: '',
    quizType: '',
  }),
  actions: {
    setSubject(subject) {
      this.subject = subject;
    },
    setChapter(chapter) {
      this.chapter = chapter;
    },
    setQuizType(quizType) {
      this.quizType = quizType;
    },
  },
});
