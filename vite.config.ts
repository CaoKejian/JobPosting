import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postcsspxtoviewport from "postcss-px-to-viewport" //插件
import { svgstore } from './src/vite_plugins/svgstore'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgstore(), vueJsx({
    transformOn: true,
    mergeProps: true
  }),
  ],
  
  server: {
    // host: '172.16.227.98',
    // host: '192.168.3.125',
    // port: 5173,
    proxy: {
      '/api': {
        target: 'http://43.139.142.203:3000',
        // target: 'http://localhost:3000',
      }
    }
  },
})
