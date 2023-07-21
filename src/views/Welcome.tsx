import { PropType, defineComponent, ref } from 'vue';
import s from './Welcome.module.scss';
import { Button } from '../shared/Button';
import { useRouter } from 'vue-router';
export const Welcome = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const router = useRouter()
    const gotoInfo = () => {
      router.push('/login')
    }
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
            <Button onClick={() => gotoInfo()}>点击进入</Button>
          </div>
          <div class={s.box}>
            <span>我是老师</span>
            <Button>点击进入</Button>
          </div>
        </div>
        <div class={s.footer}>
          <div class={s.title}>
            <span style="--index:1;"><svg class={s.icon}><use xlinkHref='#progress'></use></svg></span>
            <span style="--index: 2;">每</span>
            <span style="--index: 3;">天</span>
            <span style="--index: 4;">进</span>
            <span style="--index: 5;">步</span>
            <span style="--index: 6;">一</span>
            <span style="--index: 7;">点</span>
            <span style="--index: 8;">点</span>
            <span style="--index: 9;">啦</span>
          </div>
        </div>
      </div>
    )
  }
})

export default Welcome