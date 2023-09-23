import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';
import { watchEffect } from 'vue';

export const AnalyzeAverage = defineComponent({
  props: {
    average: {
      type: Object as PropType<{ intime: number, overtime: number }>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const datas = ref<{ value: number, name: string }[]>([])
    const maxArr = [100, 100]
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const update = () => {
      chart?.setOption({
        tooltip: {
          show: false
        },
        grid: {
          left: 70,
          bottom: 10
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '学生平均分差异_K-means聚类算法',
              type: 'png',
            },
          }
        },
        legend: {
          show: true,
          right: 0,
          top: 20,
          itemWidth: 20,
          itemHeight: 9,
          itemGap: 21,
          fontSize: 14,
          color: '#4d71bf'
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              fontSize: 14,
              color: '#4d71bf',
              margin: 21
            },
            data: datas.value.map(item => item.name)
          },
        ],
        series: [
          {
            z: 11,
            name: '平均分',
            type: 'bar',
            barWidth: 10,
            data: datas.value.map(item => ({ value: item.value })),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#7580f5' },
                { offset: 1, color: '#939bf8' }
              ])
            },
            label: {
              show: true,
              position: ['90%', -20],
              color: '#386b78',
              fontSize: 12
            }
          },
          {
            z: 10,
            name: '总分',
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#7580f5' },
                { offset: 1, color: '#d4dcf5' }
              ])
            },
            label: {
              show: true,
              position: ['95%', -20],
              color: '#4d71bf',
              fontSize: 14
            },
            data: maxArr
          },
          {
            type: 'pictorialBar',
            symbolSize: [4, 9],
            z: 12,
            itemStyle: {
              color: '939bf8',
              opacity: 0.3
            },
            data: maxArr.map(value => ({ value, symbolPosition: 'end' }))
          },
          {
            type: 'pictorialBar',
            symbolSize: [4, 9],
            symbolOffset: [3, 0],
            z: 12,
            itemStyle: {
              color: '#c8fffa',
            },
            data: datas.value.map(item => {
              return { value: item.value, symbolPosition: 'end' }
            })
          },
          {
            type: 'pictorialBar',
            symbolSize: [4, 9],
            symbolOffset: [2, 0],
            z: 12,
            itemStyle: {
              color: '#d1daf5',
              opacity: 0.4
            },
            data: [{ value: 0 }, { value: 0 }]
          },
          {
            type: 'pictorialBar',
            symbolSize: [21, 39],
            symbolOffset: [10, 0],
            z: 0,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#d1daf5' },
                { offset: 1, color: '#d1daf5' }
              ]),
            },
            data: [{ value: 0 }, { value: 0 }],
            tooltip: {
              show: false
            }
          }
        ]
      })
    }
    const handleAverage = (data: { intime: number, overtime: number }) => {
      if (data.intime === 0) return
      const y = { value: data.overtime, name: '逾期' };
      const x = { value: data.intime, name: '未逾期' };
      datas.value.push(x, y);
    }
    watchEffect(() => {
      handleAverage(props.average)
      update()
    })
    return () => (
      <div ref={refDiv} class={s.average}></div>
    )
  }
})