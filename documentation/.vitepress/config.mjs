import { defineConfig } from 'vitepress'

const base = '/HCI520-MTG-learning-site/wiki/'

export default defineConfig({
  title: 'HCI520 MTG Learning Site',
  description: 'Architecture, API reference, and contributor documentation',
  base,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'Architecture', link: '/architecture/', activeMatch: '/architecture/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' },
      { text: 'App', link: '/HCI520-MTG-learning-site/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Contributor guide',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Development workflow', link: '/guide/development' },
            { text: 'Testing', link: '/guide/testing' },
          ],
        },
        {
          text: 'Research & data',
          items: [
            { text: 'Evaluation & reporting', link: '/guide/evaluation' },
            { text: 'Privacy notice', link: '/guide/privacy' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/' },
            { text: 'C4 — Context', link: '/architecture/context' },
            { text: 'C4 — Containers', link: '/architecture/containers' },
            { text: 'C4 — Components', link: '/architecture/components' },
            { text: 'Session gating', link: '/architecture/session-flow' },
            { text: 'Deployment', link: '/architecture/deployment' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Supabase RPC',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'register_participant', link: '/api/register-participant' },
            { text: 'update_participant', link: '/api/update-participant' },
            { text: 'get_participant_progress', link: '/api/get-participant-progress' },
            { text: 'Server-side validation', link: '/api/validation' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/vivianconrad/HCI520-MTG-learning-site',
      },
    ],
    footer: {
      message: 'DePaul HCI 520 — MTG e-learning study instrument',
      copyright: 'Documentation source lives in <code>documentation/</code> in the repo',
    },
    search: {
      provider: 'local',
    },
  },
})
