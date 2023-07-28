import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './MenuBar.module.scss';
import { MainLayout } from './MainLayout';
import { BackIcon } from '../shared/BackIcon';
import { RouterLink } from 'vue-router';
import { http } from '../shared/Http';
import { Dialog } from 'vant';
export const MenuBar = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const info = ref<string>('未登录')
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
      localStorage.removeItem('jwt')
      window.location.reload()
    }
    onMounted(async () => {
      try{
        const res = await http.get('/user/verify/jwt')
        console.log(res);
        const infoObj = JSON.parse(localStorage.getItem('info')as string)
        info.value = `学号：${infoObj.stuId}`
      }catch(error:any){
        console.log(error);
        if(error.response.status===401){
          info.value = '未登录'
        }
      }
    })
    return () => (<>
      <div class={s.mask} onClick={close}></div>
      <div class={s.wrapper}>
        <div class={s.content}>
          <MainLayout>{
            {
              icon: () => <BackIcon svg='user' class={s.svg} />,
              title: () => <div class={s.title}>
                <span>{info.value}</span>
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
                    <RouterLink to="/student/handwork">
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
                    <RouterLink to="/student/downloads">
                      <svg class={s.icon}><use xlinkHref='#homedownload'></use></svg>
                      <span onClick={() => onClick(4)}>作业下载</span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            }
          }</MainLayout>
        </div>
      </div>
    </>

    )
  }
})