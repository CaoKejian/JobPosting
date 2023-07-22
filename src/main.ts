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

router.beforeEach((to, from) => {
  if (to.path === '/' || to.path === '/items' || to.path.startsWith('/welcome') || to.path.startsWith('/login')) {
    return true
  } else {
    return '/login?return_to=' + from.path
  }

})

app.use(router)
app.mount('#app')


