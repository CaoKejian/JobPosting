import { PropType, computed, defineComponent, ref } from 'vue';
import s from './Form.module.scss'
import { getFriendlyError } from './getFriendlyError';
import { Button } from './Button';
import { Popup, DatetimePicker, Picker, Checkbox } from 'vant';
import { Time } from './Time';
import { ScoreList } from './Score';
import { debounce } from './Debounce';

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
      type: String as PropType<'text' | 'emojiSelect' | 'date' | 'validationcode' | 'select' | 'search' | 'score' | 'radio'>
    },
    InputDisabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String
    },
    srachValue:{
      type: String as PropType<string>,
      default: '搜索'
    },
    radioType: {
      type: Boolean as PropType<boolean>,
      defalut: false
    },
    minDate :{
      type: [Date]
    },
    placeholder: String,
    options: Array as PropType<Array<{ value: string, text: string }>>,
    px: String,
    onClick: Function as PropType<() => void>,
    onSearch: Function as PropType<() => void>,
    countForm: {
      type: Number,
      default: 60
    },
    disabled: Boolean,
  },
  emits: ['update:modelValue', 'update:radioType'],
  setup: (props, context) => {
    const refDateVisible = ref(false)
    const refScoreVisible = ref(false)
    const checked = ref(props.radioType)
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
      props.onSearch?.()
    }
    context.expose({
      startCount
    })
    const changeRadioType = () => {
      context.emit('update:radioType', checked.value)
    }
    const handleInput = debounce((e:any) => {
      context.emit('update:modelValue', e.target.value)
    },1000)
    const content = computed(() => {
      switch (props.type) {
        case 'text':
          return <input value={props.modelValue}  autocomplete="off" 
            onInput={(e: any) => handleInput(e)}
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
            <input class={s.searchInput}
              value = {props.modelValue}
              onInput={(e: any) => context.emit('update:modelValue', e.target.value)} placeholder={props.placeholder}
            />
            <Button onClick={props.onClick} class={s.searchButton}>{props.srachValue}</Button>
          </div>
        case 'select':
          return <select class={[s.formItem, s.select]}
            onChange={((e: any) => { context.emit('update:modelValue', (e.target.value)) })}
            value={props.modelValue}
          >
            {props.options?.map(options =>
              <option value={options.text}>{options.text}</option>)}
          </select>
        case 'score':
          return <><input readonly={true} value={props.modelValue}
          placeholder={props.placeholder}
          onClick={() => { refScoreVisible.value = true }}
          class={[s.formItem, s.input]} />
          <Popup position='bottom' v-model:show={refScoreVisible.value}>
          <Picker
            title="标题"
            defaultIndex={80}
            columns={ScoreList}
            onCancel={() => refScoreVisible.value = false}
            onConfirm={(score: number) =>{
              context.emit('update:modelValue', score)
              refScoreVisible.value = false
            }}
          />
            </Popup></>
        case 'radio':
            return<>
            <Checkbox v-model={checked.value} shape="square" onClick={() => 
              changeRadioType()
              }>
              {checked.value ?
                <svg class={s.raidoIcon}><use xlinkHref='#isGood'></use></svg> :
                <svg class={s.raidoIcon}><use xlinkHref='#isNoGood'></use></svg>
              }
            </Checkbox>
            </>
        case 'date':
          return <>
            <input readonly={true} value={props.modelValue}
              placeholder={props.placeholder}
              onClick={() => { refDateVisible.value = true }}
              class={[s.formItem, s.input]} />
            <Popup position='bottom' v-model:show={refDateVisible.value}>
              <DatetimePicker vmodelValue={props.modelValue? new Date(props.modelValue): new Date()} type="date" title="选择年月日" max-date={new Date(2024, 1, 1)} min-date={props.minDate || new Date()}
                onConfirm={(date: Date) => {
                  context.emit('update:modelValue', Time(date,'YY-MM-SS'))
                  refDateVisible.value = false
                }}
                onCancel={() => refDateVisible.value = false} />
            </Popup>
          </>
        case undefined:
          return context.slots.default?.()
      }
    })
    return () => (
      <div class={s.formRow}>
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