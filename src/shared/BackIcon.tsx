import { PropType, defineComponent, ref } from 'vue';
import s from './BackIcon.module.scss';
import { useRoute, useRouter } from 'vue-router';
export const BackIcon = defineComponent({
  props: {
    svg: {
      type: String as PropType<string>,
      default: 'return'
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>
    }
  },
  setup: (props, context) => {
    const route = useRoute()
    const router = useRouter()
    const onClick = (e:MouseEvent) => {
      props.onClick?.(e)
      const { return_to } = route.query
      if (return_to) {
        router.push(return_to.toString())
      }else if(props.svg === 'menu'){
        return
      } else {
        router.back()
      }
    }
    return () => (
      <svg class={s.icon} onClick={onClick}><use xlinkHref={'#' + props.svg}></use></svg>
    )
  }
})