import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    include: ['src/**/*.{test,spec}.ts'],
    globals: false,
  },
})
