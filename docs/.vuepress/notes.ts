import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

// const demoNote = defineNoteConfig({
//   dir: 'demo',
//   link: '/demo',
//   sidebar: ['', 'foo', 'bar'],
// })

const interviewNote = defineNoteConfig({
  dir: '/interview',
  link: '/interview',
  sidebar: ['暑期面试记录'],
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [interviewNote],
})
