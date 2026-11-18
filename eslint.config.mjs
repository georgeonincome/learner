import nextConfig from 'eslint-config-next'

export default nextConfig({
  rules: {
    // Fail the build on any Material UI / Emotion import — Tailwind only
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mui/*', '@mui/**'],
            message: 'Material UI (@mui/*) is not allowed. Use Tailwind CSS instead.',
          },
          {
            group: ['@emotion/*', '@emotion/**'],
            message: 'Emotion (@emotion/*) is not allowed. Use Tailwind CSS instead.',
          },
        ],
      },
    ],
  },
})
