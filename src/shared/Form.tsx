import { PropType, computed, defineComponent, ref } from 'vue';
import s from './Form.module.scss'
import { getFriendlyError } from './getFriendlyError';
import { Button } from './Button';
export const Form = defineComponent({
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>
    }
  },
  setup: (props, context) => {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    )
  }
})

export const FormItem = defineComponent({
  props: {
    onCancel: {
      type: Function as PropType<(e: Event) => void>
    },
    label: {
      type: String
    },
    modelValue: {
      type: [String, Number, Date]
    },
    type: {
      type: String as PropType<'text' | 'emojiSelect' | 'date' | 'validationcode' | 'select' | 'search'>
    },
    InputDisabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String
    },
    placeholder: String,
    options: Array as PropType<Array<{ value: string, text: string }>>,
    px: String,
    onClick: Function as PropType<() => void>,
    countForm: {
      type: Number,
      default: 60
    },
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  setup: (props, context) => {
    const refDateVisible = ref(false)
    const timer = ref<any>()
    const count = ref<number>(props.countForm)
    const isCounting: any = computed(() => !!timer.value)
    const startCount = () => {
      timer.value = setInterval(() => {
        count.value -= 1
        if (count.value == 0) {
          clearInterval(timer.value)
          timer.value = undefined
          count.value = props.countForm
        }
      }, 1000)
    }
    const onClick = () => {
      props.onClick?.()
    }
    context.expose({
      startCount
    })
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input value={props.modelValue}  autocomplete="off" 
            onInput={(e: any) => context.emit('update:modelValue', e.target.value)}
            placeholder={props.placeholder}
            disabled={props.InputDisabled}
            class={[s.formItem, s.input]}
          ></input>
        case 'validationcode':
          return <>
            <input class={[s.formItem, s.input, s.validationcode]}
              value={props.modelValue} 
              onInput={(e: any) => context.emit('update:modelValue', e.target.value)} placeholder={props.placeholder}
            />
            <Button disabled={isCounting.value || props.disabled} onClick={props.onClick} class={s.validationcodeButton}>{isCounting.value ? `${count.value}s后可重新发送` : '发送验证码'}</Button>
          </>
        case 'search':
          return <div class={s.search}>
            <input class={[s.formItem, s.input,s.searchInput]}
              value = {props.modelValue}
              onInput={(e: any) => context.emit('update:modelValue', e.target.value)} placeholder={props.placeholder}
            />
            <Button onClick={props.onClick} class={s.searchButton}>搜索</Button>
          </div>
        case 'select':
          return <select class={[s.formItem, s.select]}
            onChange={((e: any) => { context.emit('update:modelValue', (e.target.value)) })}
            value={props.modelValue}
          >
            {props.options?.map(options =>
              <option value={options.value} >{options.text}</option>)}
          </select>
        case undefined:
          return context.slots.default?.()
      }
    })
    return () => (
      <div class={s.formRow} onClick={onClick}>
        <label class={props.px === 'level' ? s.selected : s.formLabel}>
          {props.label &&
            <span class={s.formItem_name}>{props.label}</span>
          }
          <div class={s.formItem_value}>
            {content.value}
          </div>
          {props.error &&
            <div class={s.forItem_errorHint}>
              <span class={s.forItem_span}>{props.error ? getFriendlyError(props.error) : '　'}</span>
            </div>
          }
        </label >
      </div >
    )
  }
})