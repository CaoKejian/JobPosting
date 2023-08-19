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
import { Toast, DatetimePicker, Search, Icon, Dialog, Uploader, Swipe, SwipeItem, Step, Steps, ConfigProvider } from 'vant';
import { http } from './shared/Http'
// 调试
import VConsole from 'vconsole';
function isDev() {
  if (location.hostname !== 'localhost'
    && location.hostname !== '127.0.0.1'
    && location.hostname !== '192.168.3.126') { return false }
  return true
}
// if(isDev()){
// new VConsole()
// }
const app = createApp(App)
const router = createRouter({
  history,
  routes,
})

router.beforeEach(async (to, from) => {
  if (to.path === '/' || to.path === '/student/detail' || to.path.startsWith('/welcome') || to.path.startsWith('/login')) {
    return true
  } else {
    try {
      const info = localStorage.getItem('info')
      if (!info) {
        return '/login?return_to=' + from.path
      }
      await http.get('/user/verify/jwt')
      return true
    } catch (error) {
      return '/login?return_to=' + from.path
    }
  }
})
app.use(Search)
app.use(Toast)
app.use(Icon);
app.use(Dialog);
app.use(Uploader);
app.use(Swipe);
app.use(SwipeItem);
app.use(Step);
app.use(Steps);
app.use(ConfigProvider);
app.use(DatetimePicker);

app.use(router)
app.mount('#app')


