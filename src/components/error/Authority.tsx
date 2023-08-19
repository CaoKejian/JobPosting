import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './Authority.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Button } from '../../shared/Button';
import { useRoute, useRouter } from 'vue-router';
import { removeLocal } from '../../config/utils';
export const Authority = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const goToLogin = () => {
      router.push('/login?return_to=/')
      removeLocal()
    }
    onMounted(() => {
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='goLogin'/>,
          title: () => '权限错误',
          default: () => <div class={s.wrapper}>
              <svg class={s.svg}><use xlinkHref='#noAuth'></use></svg>
              <Button onClick={() => goToLogin()}>去登录</Button>
          </div>
        }
      }</MainLayout>
    )
  }
})