import { PropType, defineComponent, ref, watch } from 'vue';
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
    classId: {
      type: String,
    },
    isShowForm:{
      type:Boolean,
      default: false
    }
  },
  emits: ['update:modelVisible', 'update:modelValue', 'update:classId'],
  setup: (props, context) => {
    const { modelVisible } = props
    const classId = ref('')
    const onclick = (num: number) => {
      if (num === 1) {
        context.emit('update:modelVisible', false)
      } else {
        context.emit('update:modelVisible', false, 1)
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
                  <span>进班码</span>
                  {props.isShowForm ?<input type="text" value={props.classId}
                    onInput={(e: any) => context.emit('update:classId', e.target.value)}
                    placeholder='六位数字' class={[s.formItem, s.input]}/> : null}
                  <span>{context.slots.content?.()}</span>
                  <div class={s.button}>
                    <Button onClick={() => onclick(1)}>{context.slots.buttonL?.() || '取消'}</Button>
                    <Button onClick={() => onclick(2)}>{context.slots.buttonR?.() || '确认'}</Button>
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