import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';

export const AnalyzeTime = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const xData = ref(['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'])
    const seriesValue = ref<{ name: string, value: number[] }[]>([])
    const legendValue = ref<string[]>([])

    const mockData = () => {
      const result = []
      const nameMap = ['曹珂俭', '黄梦瑶', '蔡奇奇', '张博涵', '捏于波', '李梓良', '王硕']
      for (let i = 0; i < 7; i++) {
        const obj: { name: string, value: number[] } = { name: '', value: [] }
        obj.name = nameMap[i]
        for (let j = 0; j < 24; j++) {
          obj.value.push(+(Math.random() * 10).toFixed(0))
        }
        result.push(obj)
      }
      seriesValue.value = result
    }
    mockData()

    const handleSeries = (data: { name: string, value: number[] }[]) => {
      const result: any = []
      data.map(item => {
        const obj: any = {}
        obj.name = item.name
        obj.data = item.value
        obj.type = 'line'
        obj.symbol = 'none'
        result.push(obj)
        legendValue.value.push(item.name)
      })
      return result
    }

    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      update()
    })
    const update = () => {
      chart?.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 25,
          data: legendValue.value
        },
        grid: {
          left: '3%',
          top: '30%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '时间段提交分析',
              type: 'png',
            },
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData.value
        },
        yAxis: {
          type: 'value'
        },
        series: handleSeries(seriesValue.value)
      })
    }
    watchEffect(() => {
      update()
    })
    return () => (
      <div ref={refDiv} class={s.time}></div>
    )
  }
})