import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';

export const HistoryQuency = defineComponent({
  props: {
    quency: {
      type: Array as PropType<{ value: number, name: string }[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const dataList = ref<{ name: string, value: number }[]>([{
      name: '09-01',
      value: 7
    }, {
      name: '09-07',
      value: 2
    }, {
      name: '09-21',
      value: 1
    }]
    )
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const update = () => {
      chart?.setOption({
        title: {
          left: 26,
          top: 26,
          color: '#000',
          fontSize: 15,
          fontWeight: 50000,
          fontFamily: 'PingFang SC'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '逾期次数趋势追踪（时间序列分析）',
              type: 'png',
            },
          }
        },
        grid: {
          left: '10%',
          right: '5%',
          bottom: '10%',
          top: '16%',
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: dataList.value.length > 15 ? 35 : 100
        }],
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#397cbc'
            }
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          //轴线上的字
          axisLabel: {
            show: true,
            color: '#2f6b77',
            fontSize: '14'
          },
          data: dataList.value.map(item => item.name)
        },
        yAxis: [{
          name: '(份/天)',
          nameTextStyle: {
            color: '#5063ec'
          },
          type: 'value',
          splitNumber: 4,
          axisTick: {
            show: false
          },
          //轴线上的字
          axisLabel: {
            show: true,
            fontSize: '14',
            color: '#2f6b77'
          },
          axisLine: {
            lineStyle: {
              color: '#397cbc'
            }
          },
          //网格线
          splitLine: {
            lineStyle: {
              color: '#11366e'
            }
          }
        }],
        series: [{
          name: '逾期份数',
          type: 'line',
          smooth: true, //是否平滑曲线显示
          showSymbol: false,
          markPoint: {
            data: [{
              name: '周最高',
              value: 320,
              xAxis: 4,
              yAxis: 320
            }]
          },
          itemStyle: {
            color: '#F3A22D',
            borderColor: '#F3A22D',
            borderWidth: 1
          },
          lineStyle: {
            width: 2,
            color: {
              type: 'linear',
              colorStops: [{
                offset: 0,
                color: '#F3A22D' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#F3A22D' // 100% 处的颜色
              }
              ],
              globalCoord: false // 缺省为 false
            },
            shadowColor: '#F3A22D',
            shadowBlur: 30,
            shadowOffsetY: 5
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [{
                offset: 0,
                color: "rgba(243,162,45, 0.6)"
              }, {
                offset: 0.6,
                color: "rgba(243,162,45, 0.2)"
              },
              {
                offset: 0.8,
                color: "rgba(243,162,45, 0.1)"
              }
              ],
              false
            ),
            shadowColor: "rgba(243,162,45, 0.1)",
            shadowBlur: 6
          },
          data: dataList.value
        }]
      })
    }
    watchEffect(() => {
      dataList.value = props.quency
      update()
    })
    return () => (
      <div ref={refDiv} class={s.subjectClass}></div>
    )
  }
})