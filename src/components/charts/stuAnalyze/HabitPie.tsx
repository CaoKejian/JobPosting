import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

interface SeriesType {
  name: string, value: number, label?: {}, labelLine?: {}, itemStyle?: {}
}
export const HabitPie = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    let mockData = [{ name: 'jpeg', value: 0.24 }, { name: 'pdf', value: 0.12 }, { name: 'docx', value: 0.32 }, { name: 'png', value: 0.27 }]
    let legendData: string[] = [], seriesData: SeriesType[] = []
    mockData.map((v, i) => {
      legendData.push(v.name)
      seriesData.push({ value: v.value, name: v.name })
    })
    for (let i = 0; i < mockData.length; i++) {
      seriesData.push({ value: 0, name: "", label: { show: false }, labelLine: { show: false }, itemStyle: { color: 'rgba(0,0,0,0)' } })
    }
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      chart.setOption({
        legend: {
          icon: 'circle',
          data: legendData,
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
          hoverAnimation: false,
          radius: [0, '85%'],
          center: ['10%', '50%'],
          type: 'pie',
          label: { normal: { show: false }, emphasis: { show: false } },
          labelLine: { normal: { show: false }, emphasis: { show: false } },
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
          data: seriesData
        }]
      })
    })
    return () => (
      <div ref={refDiv} class={s.habitPie}></div>
    )
  }
})