import { PropType, defineComponent, ref } from 'vue';
import s from './BackIcon.module.scss';
import { useRoute, useRouter } from 'vue-router';
export const BackIcon = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const route = useRoute()
    const router = useRouter()
    const onClick = () => {
      const { return_to } = route.query
      if (return_to) {
        router.push(return_to.toString())
      } else {
        router.back()
      }
    }
    return () => (
      <svg class={s.icon} onClick={onClick}><use xlinkHref='#return'></use></svg>
    )
  }
})