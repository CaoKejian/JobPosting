import { PropType, defineComponent, ref } from 'vue';
import s from './Welcome.module.scss';
import { Button } from '../shared/Button';
export const Welcome = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.main}>
          <div class={s.title}>
            <span style="--index: 1;">收</span>  
            <span style="--index: 2;">作</span>  
            <span style="--index: 3;">业</span>  
            <span style="--index: 4;">啦</span>  
          </div>
        </div>
        <div class={s.body}>
          <svg class={s.svg}>
            <use xlinkHref='#vite'></use>
          </svg>
          <div class={s.box}>
            <span>我是大学生</span>
            <Button>点击进入</Button>
          </div>
          <div class={s.box}>
            <span>我是老师</span>
            <Button>点击进入</Button>
          </div>
        </div>
        <div class={s.footer}>
           <svg class={s.icon}><use xlinkHref='#progress'></use></svg>
          <div class={s.title}>每天进步一点点啦
          </div>
        </div>
      </div>
    )
  }
})

export default Welcome