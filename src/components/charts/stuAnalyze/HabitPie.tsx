import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

interface SeriesType {
  name: string, value: number, label?: {}, labelLine?: {}, itemStyle?: {}
}
interface PieDataType {
  name: string, value: number
}
export const HabitPie = defineComponent({
  props: {
    pieData: {
      type: Array as PropType<PieDataType[]>,
      default: []
    },
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const legendData = ref<string[]>([])
    const seriesData = ref<SeriesType[]>([])
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const update = (data: PieDataType[]) => {
      chart?.setOption({
        legend: {
          icon: 'circle',
          data: legendData.value,
          textStyle: { color: '#446a76', fontSize: 12 },
          right: 20,
          top: '15%',
          orient: 'vertical',
        },
        tooltip: {
          show: true,
          formatter: function (params: SeriesType) {
            return params.name + ':  ' + params.value * 100 + '%';
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '全班类型占比',
              type: 'png',
            },
          }
        },
        grid: {
          // 调整图表容器的大小，以腾出空间放置图例
          left: '5%',
          right: '10%',
          top: '10%',
          bottom: '10%',
        },
        series: [{
          scale: false,
          radius: [0, '85%'],
          center: ['10%', '50%'],
          type: 'pie',
          label: { show: false }, emphasis: {
            labelLine: {
              show: false
            }
          },
          labelLine: {
            show: false,
          },
          animation: false,
          tooltip: { show: false },
          // 阴影颜色
          itemStyle: { color: 'rgba(39,85,255,.21)' },
          data: [{ value: 1 }, { value: 1, itemStyle: { color: 'rgba(0,0,0,0)' } }],
        }, {
          name: "",
          type: "pie",
          radius: [0, '80%'],
          avoidLabelOverlap: false,
          startAngle: 90,
          center: ["10%", "50%"],
          roseType: "area",
          selectedMode: "single",
          label: {
            show: false,
          },
          data: seriesData.value
        }]
      })
    }
    watchEffect(() => {
      props.pieData.map((v, i) => {
        legendData.value.push(v.name)
        seriesData.value.push({ value: v.value, name: v.name })
      })
      for (let i = 0; i < props.pieData.length; i++) {
        seriesData.value.push({ value: 0, name: "", label: { show: false }, labelLine: { show: false } })
      }
      update(props.pieData)
    })
    return () => (
      <div ref={refDiv} class={s.habitPie}></div>
    )
  }
})