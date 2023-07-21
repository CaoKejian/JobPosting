import { PropType, defineComponent, ref } from 'vue';
import s from './Button.module.scss';
export const Button = defineComponent({
  props: {
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>
    },
  },
  setup: (props, context) => {
    const selfDisabled = ref(false)
    const onClick = (e: MouseEvent) => {
      if (!selfDisabled.value) {
        props.onClick?.(e)
        selfDisabled.value = true
      }else{
        return
      }
      console.log(selfDisabled.value);
      setTimeout(() => {
        selfDisabled.value = false
      }, 1000)
    }
    return () => (
      <button onClick={onClick} class={s.button}>{context.slots.default?.()}</button>
    )
  }
})