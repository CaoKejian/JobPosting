import { RouteRecordRaw } from 'vue-router';
import { HandWork } from '../components/students/HandWork';

export const routes:RouteRecordRaw[] = [
  {path:'/',redirect:'/welcome'},
  {
    path:'/welcome',component:() => import('../views/Welcome')
  },
  {
    path:'/login',component:() => import('../views/Login')
  },
  {
    path:'/student',component:() => import('../views/Student'),
    children:[
      {path:'',component: HandWork}
    ]
  }
]