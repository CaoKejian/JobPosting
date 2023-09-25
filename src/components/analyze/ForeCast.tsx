import { PropType, defineComponent, reactive, ref, toRefs } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { Button } from '../../shared/Button';
import { FormItem } from '../../shared/Form';
export const ForeeCast = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const useData = reactive({
      disable: false,
      selectData: [
        { value: 'x', text: 'x' },
        { value: 'y', text: 'y' },
      ],
      isShowStudentInfo: false,
      studentInfo: {
        bit: 0,
        score: 0
      }
    })
    const { disable, selectData, isShowStudentInfo, studentInfo } = toRefs(useData)
    const handleFore = () => {
      disable.value = true
      setTimeout(() => {
        Object.assign(studentInfo.value, {
          bit: 0.65,
          score: 70.2
        })
        isShowStudentInfo.value = true
        disable.value = false
      }, 1000);
    }
    return () => (
      <div class={s.wrapper}>
        <Quote name='预测提交作业比率和预测得分' />
        <FormItem type='select' label='选择学生'
          modelValue={selectData.value[0].text}
          options={selectData.value}
        >
        </FormItem>
        <div class={s.box1}>
          <Button class={s.forecast}
            disabled={disable.value}
            onClick={handleFore}
          >
            {
              isShowStudentInfo.value ?
                <div>
                  提交作业：{studentInfo.value.bit}<br />
                  预计得分：{studentInfo.value.score}
                </div> : "点击开始预测"
            }
          </Button>
        </div>
      </div>
    )
  }
})