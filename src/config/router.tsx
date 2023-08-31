import { RouteRecordRaw } from 'vue-router';
import Statistics from '../components/students/Statistics';
import DownLoads from '../components/students/Downloads';
import { Detail } from '../components/students/Detail';
import HandWork from '../components/students/HandWork';
import View from '../components/students/View';
import { Publish } from '../components/teacher/Publish';
import { Correct } from '../components/teacher/Correct';
import { Subject } from '../components/teacher/Subject';
import { Authority } from '../components/error/Authority';
import { Auth } from '../components/teacher/Auth';

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
      { path: 'detail', component: Detail },
      { path: ':id/handWork', component: HandWork },
      { path: 'statistics', component: Statistics },
      { path: 'downloads', component: DownLoads },
      { path: 'analyze', component: () => import('../components/students/Analyze') },
    ]
  },
  {
    path: '/teacher', component: () => import('../views/Teacher'),
    children: [
      { path: '', redirect: '/teacher/publish' },
      { path: 'publish', component: Publish },
      { path: 'correct', component: Correct },
      { path: 'subject', component: Subject },
      { path: 'auth', component: Auth },
      { path: 'analyze', component: () => import('../components/teacher/Analyze') },
    ]
  }
]