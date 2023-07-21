import { RouteRecordRaw } from 'vue-router';

export const routes:RouteRecordRaw[] = [
  {path:'/',redirect:'/welcome'},
  {
    path:'/welcome',component:() => import('../views/Welcome')
  },
  {
    path:'/login',component:() => import('../views/Login')
  }
]