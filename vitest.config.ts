// import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react-swc'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: 'jsdom',
//     globals: true,
//     setupFiles: './src/test/setup.ts',
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })

// import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react-swc'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: 'jsdom',
//     globals: true,
//     setupFiles: './src/test/setup.ts',
//     // Add this to handle ESM/CJS issues
//     pool: 'forks',
//     poolOptions: {
//       forks: {
//         singleFork: true,
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // Changed from jsdom
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

// import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react-swc'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: 'jsdom',
//     globals: true,
//     setupFiles: './src/test/setup.ts',
//     // Use threads instead of forks
//     pool: 'threads',
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// })