import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './AllSchool.module.scss';
import { LineChart } from '../charts/statis/LineChart';
import { PieChart } from '../charts/statis/PieChart';
import { Quote } from '../../shared/Quote';
type dataObj = {
  name: string, value: number
}
export const AllSchool = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const LineData = ref([6647, 7473, 8190, 8488, 9491])
    const Piedata= ref<dataObj[]>([{
      name: "大数据",
      value: 54
    },
    {
      name: "智能",
      value: 11
    },
    {
      name: "计科",
      value: 20
    }])
    onMounted(() => {
      // 请求

    })
    return () => (
      <div class={s.content}>
        <p><Quote name={'作业发布排名：'}/></p>
        <LineChart data={LineData.value}/>
        <p class={s.two}><Quote name={'前三名：'}/></p>
        <PieChart data={Piedata.value}/>
      </div>
    )
  }
})