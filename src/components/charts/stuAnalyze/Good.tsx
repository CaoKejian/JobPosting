import { PropType, defineComponent, ref } from 'vue';
import s from '../statis/LineChart.module.scss';
export const Good = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    return () => (
      <div ref={refDiv} class={s.goodchart}></div>
    )
  }
})