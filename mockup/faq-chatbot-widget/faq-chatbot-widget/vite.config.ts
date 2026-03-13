import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

function stripUseClient() {
  return {
    name: 'strip-use-client',
    transform(code: string, id: string) {
      if (id.endsWith('.tsx') || id.endsWith('.ts')) {
        return code.replace(/['"]use client['"]\s*;?\n?/g, '')
      }
    },
  }
}

export default defineConfig({
  plugins: [preact(), stripUseClient()],
  build: {
    lib: {
      entry: 'src/widget-entry.tsx',
      name: 'FAQChatbot',
      formats: ['iife'],
      fileName: () => 'faq-chatbot.js',
    },
    cssFileName: 'faq-chatbot',
    rollupOptions: {
      output: {
        assetFileNames: 'faq-chatbot.[ext]',
      },
    },
  },
})
