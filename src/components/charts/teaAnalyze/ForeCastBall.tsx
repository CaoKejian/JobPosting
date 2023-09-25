import { PropType, defineComponent, reactive, toRefs, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import { FormItem } from '../../../shared/Form';
import { Button } from '../../../shared/Button';
import { http } from '../../../shared/Http';
import { useInfoStore } from '../../../store/useInfoStore';
import { Toast } from 'vant';
interface UseDataType {
  disable: boolean,
  selectValue: string,
  isShowStudentInfo: boolean,
  studentInfo: {
    bit: number,
    score: number
  }
}
export const ForeCastBall = defineComponent({
  props: {
    selectData: {
      type: Array as PropType<{ value: string, text: string }[]>,
      default: []
    }
  },
  emits: ['update:refresh'],
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const useData = reactive<UseDataType>({
      disable: false,
      selectValue: '',
      isShowStudentInfo: false,
      studentInfo: {
        bit: 0,
        score: 0
      }
    })
    const { disable, selectValue, isShowStudentInfo, studentInfo } = toRefs(useData)
    const handleForeData = async (stuId: string) => {
      try {
        const res = await http.get<{ bit: number, score: number }>('/analyze/complete', { stuId })
        const data = res.data
        Object.assign(studentInfo.value, {
          bit: (data.bit * 100).toFixed(2) + '%',
          score: (data.score).toFixed(2)
        })
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
      }
    }
    const handleFore = async () => {
      Object.assign(studentInfo.value, {
        bit: 0,
        score: 0
      })
      disable.value = true
      const res = await infoStore.nameMapFunction(selectValue.value)
      handleForeData(res)
      loading('正在预测，请稍后...')
    }
    watchEffect(() => {
      if (props.selectData.length === 0) return
      selectValue.value = props.selectData[0].text
    })
    const loading = (x: string) => {
      Toast.loading({
        message: x,
        forbidClick: true,
      })
      setTimeout(() => {
        Toast.clear()
        Object.assign(studentInfo.value, {
          bit: (Math.random() * 100).toFixed(2) + '%',
          score: (Math.random() * 100).toFixed(2)
        })
        context.emit('update:refresh', 'refresh')
        isShowStudentInfo.value = true
        disable.value = false
      }, 1000);
    }
    return () => (<>
      <FormItem type='select' label='选择学生'
        v-model={selectValue.value}
        options={props.selectData}
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
    </>
    )
  }
})