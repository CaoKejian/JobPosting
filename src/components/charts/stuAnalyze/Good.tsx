import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const Good = defineComponent({
  props: {
    indicator: {
      type: Array as PropType<string[]>,
      default: []
    },
    value: {
      type: Array as PropType<number[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const color = ['#3c90ff', '#fff225', '#24ffdf', '#ff9c3c', '#7536ff']
    const setData = () => {
      return [
        {
          value: props.value,
          itemStyle: {
            lineStyle: {
              color: '#4BFFFC',
              shadowColor: '#4BFFFC',
              shadowBlur: 5
            },
            shadowColor: '#4BFFFC',
            shadowBlur: 5
          },
          areaStyle: {
            // 单项区域填充样式
            color: {
              type: 'radial',
              x: 0.5, //右
              y: 0.5, //下
              r: 1,
              colorStops: [
                {
                  offset: 1,
                  color: '#4BFFFC'
                },
                {
                  offset: 0,
                  color: 'rgba(0,0,0,0)'
                }
              ],
              globalCoord: false
            },
            opacity: 0.8 // 区域透明度
          }
        }
      ]
    }
    const setgauge = (i: number) => {
      return {
        type: 'gauge',
        detail: false,
        splitNumber: 10, //刻度数量
        radius: '90%', //图表尺寸
        center: ['50%', '50%'],
        startAngle: 90 + 72 * i + 18, //开始刻度的角度
        endAngle: 90 + 72 * (i + 1) - 18, //结束刻度的角度
        axisLine: {
          show: false
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#7580f5',
            width: 1
          },
          length: 6,
          splitNumber: 1
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
    }
    const setSpot = () => {
      var scatterData: any[] = []
      props.value?.map((o, i) => {
        scatterData.push({
          value: [o, i],
          itemStyle: {
            color: color[i],
            borderColor: '#fff',
            borderWidth: 1,
            shadowColor: color[i],
            shadowBlur: 8
          }
        })
      })
      return scatterData
    }
    const update = (indicator: { name: string, max: number }[], value: number[]) => {
      chart?.setOption({
        polar: {
          center: ['50%', '50%'],
          radius: '70%'
        },
        radar: {
          shape: 'circle',
          center: ['50%', '50%'],
          radius: '70%',
          indicator: indicator,
          axisName: {
            color: '#446a76',
            fontSize: 12,
            padding: -10
          },
          axisNameGap: 25,
          splitNumber: 4,
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(210, 218, 243, 0.4)']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#5aa3d0'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(99,192,251,0.2)',
              width: 2
            }
          }
        },
        angleAxis: {
          type: 'category',
          data: name,
          minInterval: 1,
          boundaryGap: false,
          clockwise: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        radiusAxis: {
          min: 0,
          max: 100,
          interval: 25,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(210, 218, 243,1)'
            }
          },
          axisLabel: {
            fontSize: 12,
            color: '#5aa3d0',
            align: 'left',
            margin: -5
          }
        },
        series: [
          setgauge(0),
          setgauge(1),
          setgauge(2),
          setgauge(3),
          setgauge(4),
          {
            type: 'radar',
            silent: true,
            lineStyle: {
              color: 'rgba(212, 219, 242,1)'
            },
            areaStyle: {
              color: 'rgba(228, 232, 242, 1)'
            },
            data: setData()
          },
          {
            type: 'scatter',
            coordinateSystem: 'polar',
            symbolSize: 10,
            data: setSpot()
          }
        ]
      })
    }
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    watchEffect(() => {
      const indicator: { name: string, max: number }[] = []
      let obj = { name: '', max: 100 }
      props.indicator?.map(item => {
        obj = { name: '', max: 100 }
        obj.name = item
        indicator.push(obj)
      })
      update(indicator, props.value)
    })
    return () => (
      <div ref={refDiv} class={s.goodchart}></div>
    )
  }
})