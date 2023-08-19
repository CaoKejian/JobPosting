import { RouteRecordRaw } from 'vue-router';
import Statistics from '../components/students/Statistics';
import DownLoads from '../components/students/Downloads';
import { Detail } from '../components/students/Detail';
import HandWork from '../components/students/HandWork';
import View from '../components/students/View';
import { FeedBack } from '../components/students/FeedBack';
import { Analyze } from '../components/students/Analyze';
import { Publish } from '../components/teacher/Publish';
import { Correct } from '../components/teacher/Correct';
import { Search } from '../components/teacher/Search';
import { Subject } from '../components/teacher/Subject';
import { Authority } from '../components/error/Authority';

export const routes:RouteRecordRaw[] = [
  {path:'/',redirect:'/welcome'},
  {
    path:'/welcome',component:() => import('../views/Welcome')
  },
  {
    path:'/login',component:() => import('../views/Login')
  },
  {
    path: '/error', component:() => import('../views/Error'),
    children:[
      {path:'', redirect:'/error/noauth'},
      {path:'noauth',component: Authority},
    ]
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
      {path:'analyze',component: () => import('../components/students/Analyze')},
    ]
  },
  {
    path:'/teacher',component: () => import('../views/Teacher'),
    children:[
      {path:'', redirect:'/teacher/publish'},
      {path:'publish',component: Publish},
      {path:'correct',component: Correct},
      {path:'search',component: Search},
      {path:'subject',component: Subject},
      {path:'analyze',component: () => import('../components/teacher/Analyze')},
    ]
  }
]