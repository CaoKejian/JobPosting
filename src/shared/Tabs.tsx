import { PropType, defineComponent, ref } from 'vue';
import s from './Tabs.module.scss';
export const Tabs = defineComponent({
  props: {
    selected: {
      type: String as PropType<string>,
      required: false,
    },
    rerenderOnSelect: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  emits: ['update:selected'],
  setup: (props, context) => {
    return () => {
      const array = context.slots.default?.()
      if (!array) return () => null
      for (let i = 0; i < array.length; i++) {
        if (array[i].type !== Tab) {
          throw new Error('Tabss only accepts Tab as childrens')
        }
      }
      return <div class={s.tabs}>
        <ol class={s.tabs_nav}>
          {array.map(item =>
            <li class={item.props?.value === props.selected ? s.selected : s.li}
              onClick={() => context.emit('update:selected', item.props?.value)}
            >
              {item.props?.name}</li>)}
        </ol>
        {props.rerenderOnSelect ?
          <div key={props.selected} class={s.content}>
            {array.find(item => item.props?.value === props.selected)}
          </div> :
          <div>
            {array.map(item =>
              <div v-show={item.props?.value === props.selected}>{item}</div>
            )}
          </div>
        }
      </div>
    }
  }
})

export const Tab = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
      required: true
    },
    value: {
      type: String as PropType<string>,
      required: true
    },
  },
  setup: (props, context) => {
    return () => (
      <div>
        {context.slots.default?.()}
      </div>
    )
  }
})
