import { PropType, defineComponent, ref } from 'vue';
import s from './FloatButton.module.scss';
import { useRouter } from 'vue-router';
export const FloatButton = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const router = useRouter()
    const onclick = () => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      router.push(`/student/1/handWork`)
    }
    return () => (
      <div class={s.wrapper} onClick={onclick}>
        <svg class={s.svg}><use xlinkHref='#submit'></use></svg>
      </div>
    )
  }
})