import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const SimilarityChart = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const xData = ref(['数据挖掘','Vue3','TypeScript','React','Css'])
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      chart.setOption({
        grid: {
          left: '45%',
          right: '10%',
          top: '10%',
          bottom: '10%',
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '学科之间的相关性',
              type: 'png',
            },
          }
        },
        parallelAxis: [
          { dim: 0, name: xData.value[0]},
          { dim: 1, name: xData.value[1] },
          { dim: 2, name: xData.value[2] },
          { dim: 3, name: xData.value[3] },
          { dim: 4, name: xData.value[4] },
          {
            dim: 5,
            name: '相对',
            type: 'category',
            data: xData.value
          },
        ],
        series: {
          type: 'parallel',
          lineStyle: {
            width: 4
          },
          data: [
            [12.99, 100, 82,12.99, 100, 'x'],
            [9.99, 80, 77,9.99, 80, 'x'],
            [20, 90, 60,20, 90, 'x'],
            [10, 60, 120,10, 60, 'x'],
            [30, 50, 80,30, 50, 'x'],
          ]
        }
      })
    })
    return () => (
      <div ref={refDiv} class={s.averagechart}></div>
    )
  }
})