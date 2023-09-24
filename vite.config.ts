import { build, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcsspxtoviewport from "postcss-px-to-viewport" //插件
import { svgstore } from './src/vite_plugins/svgstore'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          if (id.includes('echarts')) {
            return 'echarts';
          }
          if (id.includes('vant')) {
            return 'vant';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  plugins: [vue(), svgstore(), vueJsx({
    transformOn: true,
    mergeProps: true
  }),
  ],

  server: {
    proxy: {
      '/api': {
        // target: 'http://124.70.188.74/',
        target: 'http://localhost:3000',
      }
    }
  },
})
