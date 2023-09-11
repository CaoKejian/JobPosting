import { PropType, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import s from './WeekFrequency.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { Time } from '../../shared/Time';
import { WeekChart } from '../charts/stuAnalyze/WeekChart';
import { Quote } from '../../shared/Quote';
import { Toast } from 'vant';

interface UseData {
  selectDate: string
  minDate: any
  data: number[]
}
export const WeekFrequency = defineComponent({
  setup: (props, context) => {
    const useData = reactive<UseData>({
      selectDate: '',
      minDate: null,
      data: [9, 40, 30, 42, 30, 25, 43]
    })
    const { selectDate, minDate, data } = toRefs(useData)
    watch(() => selectDate.value, (newValue) => {
      fetchWeekFrequency(newValue)
    })
    const fetchWeekFrequency = async (time: string) => {
      try {
        await http.get('/analyze/week/frequency', {
          time,
          name: '曹珂俭'
        }, { _autoLoading: true })
        data.value = [+(Math.random()*100).toFixed(0), 40, 30, +(Math.random()*100).toFixed(0), 30, 25, +(Math.random()*100).toFixed(0)]
      } catch (err) {
        Toast({message:'网络异常，此为Mock环境！'})
        data.value = [+(Math.random()*100).toFixed(0), 40, 30, +(Math.random()*100).toFixed(0), 30, 25, +(Math.random()*100).toFixed(0)]
        console.log(err)
      }
    }
    onMounted(() => {
      fetchWeekFrequency(Time(new Date(), 'YY-MM-SS'))
      const currentDate = new Date();
      minDate.value = new Date(currentDate);
      minDate.value.setFullYear(currentDate.getFullYear() - 1);
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='选择日期可以查看最近一周的提交频率'/>
        <Form>
          <FormItem type='date' label='选择日期' v-model={selectDate.value}
            minDate={minDate.value}
          >
          </FormItem>
        </Form>
        <WeekChart data={data.value}/>
      </div>
    )
  }
})