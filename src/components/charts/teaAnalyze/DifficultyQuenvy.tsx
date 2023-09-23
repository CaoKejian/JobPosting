import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';
import { Toast } from 'vant';

export const DifficultyQuency = defineComponent({
  props: {
    average: {
      type: Array as PropType<number[]>,
      default: []
    },
    subject: {
      type: Array as PropType<string[]>,
      default: []
    },
    x: {
      type: Array as PropType<{}[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const weekCategory = ref<string[]>([]) //x轴数据
    const radarData = ref<number[]>([]) //雷达图数据
    const maxData = 100 // 条形图最大值
    const weekLineData = ref<number[]>([]) //x轴数据

    const color = {
      linearYtoG: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: '#7580f5'
        }, {
          offset: 1,
          color: '#939bf8'
        }]
      },
      linearGtoB: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0,
          color: '#7580f5'
        }, {
          offset: 1,
          color: '#939bf8'
        }]
      },
      linearBtoG: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0,
          color: '#7580f5'
        }, {
          offset: 1,
          color: '#939bf8'
        }]
      },
      areaBtoG: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(35,184,210,.2)'
        }, {
          offset: 1,
          color: 'rgba(35,184,210,0)'
        }]
      }
    }
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const handleSubject = () => {
      const arr: { name: string }[] = []
      props.subject.map(item => {
        arr.push({ name: item })
      })
      return arr
    }
    const update = () => {
      chart?.setOption({
        legend: {
          top: 220,
          left: 20,
          orient: 'vertical',
          itemGap: 15,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: 'rgba(77, 113, 191)',
            fontSize: 14,
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '学科平均分与难度估测',
              type: 'png',
            },
          }
        },
        tooltip: {
          trigger: 'item'
        },
        radar: {
          center: ['65%', '20%'],
          radius: '40%',
          axisName: {
            color: '#606eed'
          },
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              color: color.linearYtoG,
              opacity: .6
            }
          },
          splitLine: {
            lineStyle: {
              color: color.linearYtoG,
              opacity: .6
            }
          },
          splitArea: {
            areaStyle: {
              color: '#fff',
              opacity: .1,
              shadowBlur: 25,
              shadowColor: '#000',
              shadowOffsetX: 0,
              shadowOffsetY: 5,
            }
          },
          indicator: handleSubject()
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 40,
          top: '50%',
        },
        xAxis: {
          type: 'category',
          position: 'bottom',
          axisLabel: {
            color: '#386b77',
            fontSize: 12
          },
          data: weekCategory.value,
          axisLine: {
            lineStyle: {
              color: 'rgba(127, 163, 169)' // 设置 x 轴底线的颜色，这里是红色
            }
          }
        },
        yAxis: {
          name: '分',
          nameLocation: 'end',
          nameGap: 14,
          nameTextStyle: {
            color: '#6e7feb',
            fontSize: 14
          },
          max: maxData,
          splitNumber: 4,
          axisLabel: {
            color: '#386b77',
            fontSize: 12
          }
        },
        series: [{
          name: '学科平均分与难度估测',
          type: 'radar',
          symbolSize: 0,
          data: [
            {
              value: radarData.value,
              name: '难度预估',
              itemStyle: {
                color: 'rgba(77, 113, 191)',
              },
              lineStyle: {
                opacity: 0,
              },
              areaStyle: {
                color: color.linearGtoB,
                shadowBlur: 15,
                shadowColor: 'rgba(0,0,0,.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 5,
                opacity: .8
              },
            }]
        }, {
          name: '学科平均分',
          type: 'line',
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 8,
          itemStyle: {
            color: '#5764f1'
          },
          lineStyle: {
            color: color.linearBtoG,
            width: 2
          },
          areaStyle: {
            color: color.areaBtoG,
          },
          data: weekLineData.value,
          lineSmooth: true,
          markLine: {
            silent: true,
            data: [{
              type: 'average',
              name: '平均分'
            }],
            precision: 0,
            label: {
              formatter: '平均分 \n {c}'
            },
            lineStyle: {
              color: 'rgba(77, 113, 191,.7)'
            }
          },
          tooltip: {
            position: 'top',
            formatter: '{c} 分',
            backgroundColor: 'rgba(77, 113, 191,.2)',
            padding: 6
          }
        }],
      })
    }
    watchEffect(() => {
      Toast.loading({
        message: '正在预估，请稍等...',
        forbidClick: true,
      })
      weekCategory.value = props.subject
      radarData.value = props.average
      weekLineData.value = props.average
      setTimeout(() => {
        update()
        Toast.clear()
      }, 1000);
    })
    return () => (
      <div ref={refDiv} class={s.difficulty}></div>
    )
  }
})