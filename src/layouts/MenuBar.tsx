import { PropType, defineComponent, ref } from 'vue';
import s from './MenuBar.module.scss';
import { MainLayout } from './MainLayout';
import { BackIcon } from '../shared/BackIcon';
export const MenuBar = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const close = () => {
      props.onClose?.()
    }
    return () => (<>
    <div class={s.mask} onClick={close}></div>
      <div class={s.wrapper}>
        <div class={s.content}>
          <MainLayout>{
            {
              icon: () => <BackIcon svg='user' class={s.svg}/>,
              title:() => '未登录',
              default: () => <div>111</div>
            }  
          }</MainLayout>
        </div>
      </div>
    </>

    )
  }
})