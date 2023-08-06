import { RouteRecordRaw } from 'vue-router';
import Statistics from '../components/students/Statistics';
import DownLoads from '../components/students/Downloads';
import { Detail } from '../components/students/Detail';
import HandWork from '../components/students/HandWork';
import View from '../components/students/View';
import { FeedBack } from '../components/students/FeedBack';
import { Analyze } from '../components/students/Analyze';

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
      {path:'view/:id',component: View},
      {path:':id/handWork',component: HandWork},
      {path:'statistics',component: Statistics},
      {path:'downloads',component: DownLoads},
      {path:'feedBack',component: FeedBack},
      {path:'analyze',component: Analyze},
    ]
  }
]