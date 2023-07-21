import { createApp } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { routes } from './config/router'
import { history } from './shared/history'
import './assets/css/reset.scss'
import './assets/css/vari.scss'
import "@svgstore"
import './assets/fonts/fonts.css'
import 'vant/lib/index.css';

const app = createApp(App)
const router = createRouter({
  history,
  routes,
})
app.use(router)
app.mount('#app')


