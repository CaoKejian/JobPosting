import { RouteRecordRaw } from 'vue-router';
import { Authority } from '../components/error/Authority';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  {
    path: '/welcome', component: () => import('../views/Welcome')
  },
  {
    path: '/login', component: () => import('../views/Login')
  },
  {
    path: '/error', component: () => import('../views/Error'),
    children: [
      { path: '', redirect: '/error/noauth' },
      { path: 'noauth', component: Authority },
    ]
  },
  {
    path: '/feedback', component: () => import('../components/students/FeedBack')
  },
  {
    path: '/view/:id', component: () => import('../components/students/View')
  },
  {
    path: '/student', component: () => import('../views/Student'),
    children: [
      { path: '', redirect: '/student/detail' },
      { path: 'detail', component:() => import('../components/students/Detail') },
      { path: ':id/handWork', component:() => import('../components/students/HandWork') },
      { path: 'statistics', component:() => import('../components/students/Statistics') },
      { path: 'downloads', component:() => import('../components/students/Downloads') },
      { path: 'analyze', component: () => import('../components/students/Analyze') },
    ]
  },
  {
    path: '/teacher', component: () => import('../views/Teacher'),
    children: [
      { path: '', redirect: '/teacher/publish' },
      { path: 'publish', component:() => import('../components/teacher/Publish') },
      { path: 'correct', component: import('../components/teacher/Correct') },
      { path: 'subject', component:() => import('../components/teacher/Subject') },
      { path: 'auth', component:() => import('../components/teacher/Auth') },
      { path: 'handuser', component:() => import('../components/teacher/Handuser') },
      { path: 'analyze', component: () => import('../components/teacher/Analyze') },
    ]
  }
]