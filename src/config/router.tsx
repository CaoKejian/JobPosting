import { RouteRecordRaw } from 'vue-router';
import { HandWork } from '../components/students/HandWork';
import Detail from '../components/students/Detail';
import Statistics from '../components/students/Statistics';
import DownLoads from '../components/students/Downloads';

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
      {path:'', redirect:'/student/detail'},
      {path:'detail',component: Detail},
      {path:'handWork',component: HandWork},
      {path:'statistics',component: Statistics},
      {path:'downloads',component: DownLoads}
    ]
  }
]