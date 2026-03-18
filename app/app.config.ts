export default defineAppConfig({
  title: 'URLify',
  email: '',
  github: '',
  twitter: '',
  telegram: '',
  mastodon: '',
  blog: '',
  description: 'Modern URL Shortener with Analytics',
  image: '/banner.png',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
    'notes',
  ],
})
