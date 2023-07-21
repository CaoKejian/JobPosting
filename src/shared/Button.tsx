import { PropType, computed, defineComponent, ref } from 'vue';
import s from './Button.module.scss';
export const Button = defineComponent({
  props: {
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>
    },
    level: {
      type: String as PropType<'important' | 'danger' | 'normal'>,
      default: 'important'
    },
    type: {
      type: String as PropType<'submit' | 'button'>,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autoSelfDisabled: {
      type: Boolean,
      default: false
    }
  },
  setup: (props, context) => {
    const selfDisabled = ref(false)
    const _disabled = computed(() => {
      if(props.autoSelfDisabled === false){
        return props.disabled
      }
      if (selfDisabled.value) {
        return true
      } else {
        return props.disabled
      }
    })
    const onClick = (e: MouseEvent) => {
      if (!selfDisabled.value) {
        props.onClick?.(e)
        selfDisabled.value = true
      } else {
        return
      }
      setTimeout(() => {
        selfDisabled.value = false
      }, 1000)
    }
    return () => (
      <button onClick={onClick}disabled={_disabled.value} type={props.type} class={[s.button, s[props.level]]}>{context.slots.default?.()}</button>
    )
  }
})