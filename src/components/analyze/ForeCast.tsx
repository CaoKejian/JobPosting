import { PropType, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { Button } from '../../shared/Button';
import { FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { useInfoStore } from '../../store/useInfoStore';
import { Toast } from 'vant';
interface UseDataType {
  disable: boolean,
  selectData: { value: string, text: string }[],
  selectValue: string,
  isShowStudentInfo: boolean,
  studentInfo: {
    bit: number,
    score: number
  }
}
export const ForeeCast = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const useData = reactive<UseDataType>({
      disable: false,
      selectData: [],
      selectValue: '',
      isShowStudentInfo: false,
      studentInfo: {
        bit: 0,
        score: 0
      }
    })
    const { disable, selectData, selectValue, isShowStudentInfo, studentInfo } = toRefs(useData)
    const handleForeData = async (stuId: string) => {
      const res = await http.get<{ bit: number, score: number }>('/analyze/complete', { stuId })
      const data = res.data
      Object.assign(studentInfo.value, {
        bit: (data.bit * 100).toFixed(2) + '%',
        score: (data.score).toFixed(2)
      })
    }
    const handleFore = async () => {
      disable.value = true
      const res = await infoStore.nameMapFunction(selectValue.value)
      handleForeData(res)
      loading('正在预测，请稍后...')
    }
    watch(() => selectValue.value, (n) => {
      selectValue.value = n
    })
    const handleStudentInfo = async () => {
      const info = infoStore.student
      for (const item of Object.entries(info)) {
        const obj = { value: '', text: '' }
        obj.value = item[0]
        obj.text = item[1]
        selectData.value.push(obj)
      }
      selectValue.value = selectData.value[0].text
    }
    const loading = (x: string) => {
      Toast.loading({
        message: x,
        forbidClick: true,
      })
      setTimeout(() => {
        Toast.clear()
        isShowStudentInfo.value = true
        disable.value = false
      }, 1000);
    }
    onMounted(() => {
      handleStudentInfo()
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='预测提交作业比率和预测得分' />
        <FormItem type='select' label='选择学生'
          v-model={selectValue.value}
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