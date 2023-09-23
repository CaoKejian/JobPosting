import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';

export const AnalyzeAverage = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const datas = ref([
      { value: 60, name: '逾期' },
      { value: 80, name: '未逾期' },
    ])
    const maxArr = [100, 100]
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      update()
    })
    const update = () => {
      chart?.setOption({
        tooltip: {
          show: false
        },
        grid: {
          left: 70,
          bottom:10
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
          textStyle: {
            fontSize: 14,
            color: '#4d71bf'
          },
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
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#7580f5' },
                  { offset: 1, color: '#939bf8' }
                ])
              }
            },
            label: {
              normal: {
                show: true,
                position: ['90%', -20],
                textStyle: {
                  color: '#386b78',
                  fontSize: 12
                }
              }
            }
          },
          {
            z: 10,
            name: '总分',
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#7580f5' },
                  { offset: 1, color: '#d4dcf5' }
                ])
              }
            },
            label: {
              normal: {
                show: true,
                position: ['95%', -20],
                textStyle: {
                  color: '#4d71bf',
                  fontSize: 14
                }
              }
            },
            data: maxArr
          },
          {
            type: 'pictorialBar',
            symbolSize: [4, 9],
            z: 12,
            itemStyle: {
              normal: {
                color: '939bf8',
                opacity: 0.3
              }
            },
            data: maxArr.map(value => ({ value, symbolPosition: 'end' }))
          },
          {
            type: 'pictorialBar',
            symbolSize: [4, 9],
            symbolOffset: [3, 0],
            z: 12,
            itemStyle: {
              normal: {
                color: '#c8fffa',
              }
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
              normal: {
                color: '#d1daf5',
                opacity: 0.4
              }
            },
            data: [{ value: 0 }, { value: 0 }]
          },
          {
            type: 'pictorialBar',
            symbolSize: [21, 39],
            symbolOffset: [10, 0],
            z: 0,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#d1daf5' },
                  { offset: 1, color: '#d1daf5' }
                ]),
              }
            },
            data: [{ value: 0 }, { value: 0 }],
            tooltip: {
              show: false
            }
          }
        ]
      })
    }
    
    return () => (
      <div ref={refDiv} class={s.average}></div>
    )
  }
})