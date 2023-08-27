import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './MenuBar.module.scss';
import { MainLayout } from './MainLayout';
import { BackIcon } from '../shared/BackIcon';
import { RouterLink, useRouter } from 'vue-router';
import { http } from '../shared/Http';
import { Dialog } from 'vant';
export const MenuBar = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    },
    name: {
      type: String as PropType<string>,
      default: 'student'
    }
  },
  setup: (props, context) => {
    const info = ref<string>('未登录')
    const router = useRouter()
    const close = () => {
      props.onClose?.()
    }
    const onClick = (i: number) => {
      props.onClose?.()
    }
    const onEdit = async () => {
      close()
      await Dialog.confirm({
        title: "提示",
        message: "你真的要退出登录吗？"
      })
      const removeArr = ['jwt', 'classID', 'info']
      for (const item of removeArr) {
        localStorage.removeItem(item)
      }
      window.location.reload()
    }
    const goToLogin = () => {
      router.push('/login')
    }
    onMounted(async () => {
      try {
        const infoObj = JSON.parse(localStorage.getItem('info') as string)
        info.value = `学号：${infoObj.stuId}`
        const res = await http.get('/user/verify/jwt')
      } catch (error: any) {
        if (error.response.status === 401) {
          info.value = '未登录'
        }
      }
    })
    return () => (<>
      <div class={s.mask} onClick={close}></div>
      <div class={s.wrapper}>
        <div class={s.content}>
          {
            props.name === 'student' ?
            <MainLayout>{
              {
                icon: () => <BackIcon svg='user' class={s.svg} />,
                title: () => <div class={s.title}>
                  <span onClick={goToLogin}>{info.value}</span>
                  {
                    info.value !== '未登录' ?
                      <span onClick={onEdit}>退出登录</span> : null
                  }
                </div>,
                default: () => <div class={s.list}>
                  <ul>
                    <li>
                      <RouterLink to="/student/detail">
                        <svg class={s.icon}><use xlinkHref='#homedetail'></use></svg>
                        <span onClick={() => onClick(1)}>作业详情</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/student/submit/handwork">
                        <svg class={s.icon}><use xlinkHref='#homesubmit'></use></svg>
                        <span onClick={() => onClick(2)}>作业提交</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/student/statistics">
                        <svg class={s.icon}><use xlinkHref='#homestatiscs'></use></svg>
                        <span onClick={() => onClick(3)}>作业统计</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/student/analyze">
                        <svg class={s.icon}><use xlinkHref='#analyze'></use></svg>
                        <span onClick={() => onClick(7)}>数据分析</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/student/downloads">
                        <svg class={s.icon}><use xlinkHref='#homedownload'></use></svg>
                        <span onClick={() => onClick(4)}>作业下载</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/student/feedback">
                        <svg class={s.icon}><use xlinkHref='#homefeedback'></use></svg>
                        <span onClick={() => onClick(5)}>用户反馈</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/">
                        <svg class={s.icon}><use xlinkHref='#home'></use></svg>
                        <span onClick={() => onClick(6)}>回到首页</span>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              }
            }</MainLayout> :
            <MainLayout>{
              {
                icon: () => <BackIcon svg='user' class={s.svg} />,
                title: () => <div class={s.title}>
                  <span onClick={goToLogin}>{info.value}</span>
                  {
                    info.value !== '未登录' ?
                      <span onClick={onEdit}>退出登录</span> : null
                  }
                </div>,
                default: () => <div class={s.list}>
                  <ul>
                    <li>
                      <RouterLink to="/teacher/publish">
                        <svg class={s.icon}><use xlinkHref='#publish'></use></svg>
                        <span onClick={() => onClick(1)}>作业发布</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/teacher/correct">
                        <svg class={s.icon}><use xlinkHref='#correct'></use></svg>
                        <span onClick={() => onClick(2)}>作业批改</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/teacher/subject">
                        <svg class={s.icon}><use xlinkHref='#subject'></use></svg>
                        <span onClick={() => onClick(2)}>新的学科</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/teacher/search">
                        <svg class={s.icon}><use xlinkHref='#worksearch'></use></svg>
                        <span onClick={() => onClick(3)}>作业查询</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/teacher/analyze">
                        <svg class={s.icon}><use xlinkHref='#analyze'></use></svg>
                        <span onClick={() => onClick(7)}>数据分析</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/teacher/auth">
                        <svg class={s.icon}><use xlinkHref='#setAuth'></use></svg>
                        <span onClick={() => onClick(8)}>权限配置</span>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/">
                        <svg class={s.icon}><use xlinkHref='#home'></use></svg>
                        <span onClick={() => onClick(6)}>回到首页</span>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              }
            }</MainLayout>
          }
        </div>
      </div>
    </>

    )
  }
})