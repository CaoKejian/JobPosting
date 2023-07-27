import { PropType, defineComponent, ref } from 'vue';
import s from './Model.module.scss';
import { Button } from './Button';
export const Model = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    },
    modelVisible: {
      type: Boolean,
      default: false
    },
    modelValue:{
      type: Number,
      default: 0
    }
  },
  emits:['update:modelVisible','update:modelValue'],
  setup: (props, context) => {
    const { modelVisible } = props
    const onclick =(num:number) => {
      if(num===1){
        context.emit('update:modelVisible', false)
      }else{
        context.emit('update:modelValue',1)
        context.emit('update:modelVisible', false,1)
      }
    }
    return () => (<>
      {
        modelVisible ?
          <div class={s.wrapper} >
            <div class={s.box}>
              <div class={s.top}>{context.slots.title?.()}</div>
              <div class={s.bottom}>
                <div class={s.content}>
                  <span>{context.slots.content?.()}</span>
                  <div class={s.button}>
                    <Button onClick={() => onclick(1)}>{context.slots.buttonL?.()||'取消'}</Button>
                    <Button onClick={() => onclick(2)}>{context.slots.buttonR?.()||'确认'}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          : null
      }
    </>
    )
  }
})