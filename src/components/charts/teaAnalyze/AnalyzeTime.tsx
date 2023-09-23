import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';
import { Daum, Result, Root } from '../../analyze/HandAnalyze';
import { Toast } from 'vant';

type ResultItem = { allSubmit: number, score: number, time: string }
export const AnalyzeTime = defineComponent({
  props: {
    timeAndScore: {
      type: Object as PropType<Root>,
      default: {}
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const xData = ref(['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'])
    const seriesValue = ref<{ name: string, value: number[] }[]>([])
    const scoreArr = ref<any[]>([])
    const legendValue = ref<string[]>([])
    const maxTime = ref<number | null>(null)

    const handleSeries = (data: { name: string, value: number[] }[]) => {
      const result: any = []
      data.map(item => {
        const obj: any = {}
        obj.name = item.name
        obj.data = item.value
        obj.type = 'line'
        obj.symbol = 'none'
        obj.score = '1'
        result.push(obj)
        legendValue.value.push(item.name)
      })
      return result
    }
    const handleData = (data: Root) => {
      const { maxtime, result } = data
      maxTime.value = maxtime
      result.map((item) => {
        const obj: { name: string, value: number[] } = { name: '', value: [] }
        obj.name = item.name
        scoreArr.value.push(item.data)
        item.data.map(it => {
          obj.value.push(it.allSubmit)
        })
        seriesValue.value.push(obj)
      })
    }
    const searchScore = (time: string, index: number) => {
      return scoreArr.value[index].find((item: { time: string }) => {
        return item.time === time
      }).score
    }
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      update()
    })
    const update = () => {
      chart?.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            let Xname = ''
            let tooltipText = ''
            for (let i = 0; i < params.length; i++) {
              const { marker, name, seriesIndex, seriesName, value } = params[i]
              Xname = name
              tooltipText += `${marker} ${seriesName} ${value}份 平均分：${searchScore(name, seriesIndex)}<br />`
            }
            return `时间 ${Xname} <br /> ${tooltipText}`
          }
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
      Toast.loading({
        message: '正在分析，请稍等...',
        forbidClick: true,
      })
      handleData(props.timeAndScore)
      setTimeout(() => {
        update()
        Toast.clear()
      }, 1000);
    })
    return () => (
      <div ref={refDiv} class={s.time}></div>
    )
  }
})