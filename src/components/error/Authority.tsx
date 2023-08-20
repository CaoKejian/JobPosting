import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './Authority.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Button } from '../../shared/Button';
import { useRoute, useRouter } from 'vue-router';
import { removeLocal } from '../../config/utils';
import { Model } from '../../shared/Model';
export const Authority = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const isGoto = ref(false)
    const goToLogin = () => {
      router.push('/login?return_to=/')
      removeLocal()
    }
    const onChangeModel = async(value1:string,value2:number) => {
      if(value2 === 1){
        goToLogin()
      }
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='goLogin'/>,
          title: () => '权限错误',
          default: () => <><div class={s.wrapper}>
              <svg class={s.svg}><use xlinkHref='#noAuth'></use></svg>
              <Button onClick={() => isGoto.value = true}>去登录</Button>
          </div>
          {
            isGoto.value ?
              <Model v-model:modelVisible={isGoto.value}
                onUpdate:modelVisible={onChangeModel}
              >{
                {
                  title:() => '确认去登录吗？',
                  content:() => <div>
                  此操作回删掉登录信息！
                  </div>,
                }
              }</Model> : null
          }
          </>
        }
      }</MainLayout>
    )
  }
})