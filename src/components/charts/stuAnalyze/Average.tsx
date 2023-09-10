import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const Average = defineComponent({
  props: {
    value: {
      type: Array as PropType<number[]>,
      default: []
    },
    quency: {
      type: Array as PropType<number[]>,
      default: []
    },
    subject: {
      type: Array as PropType<string[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const legendData = ['学科平均分', '趋势'];
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const update = (value: number[], quency: number[], subject: string[]) => {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: 'none'
          },
          formatter: (params: any) => {
            return `
                 <div style="font-size: 14px;font-family: Source Han Sans CN-Medium;font-weight: 500;color: #FFFFFF;margin-bottom:12px;">${params[0].name}</div>
                 <div style="font-size: 14px;font-family: Source Han Sans CN-Medium;font-weight: 500;color: #FFFFFF;margin-bottom:4px;">${legendData[0]}：${params[0].value}分</div>
                 <div style="font-size: 14px;font-family: Source Han Sans CN-Medium;font-weight: 500;color: #FFFFFF;margin-bottom:4px;">${legendData[1]}：${params[1].value}%</div>`
          },
          extraCssText: 'opacity: 0.8;background-color:#050F1B;padding:16px;box-shadow: 1px 6px 15px 1px rgba(0,0,0,0.13);border-radius: 4px;filter: blur(undefinedpx);border:none;'
        },
        grid: {
          top: '10%',//上边距
          right: '16',//右边距
          left: '16',//左边距
          bottom: '4%',//下边距
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: subject,
          axisTick: {
            show: false //隐藏X轴刻度
          },
          axisLine: {
            lineStyle: {
              color: "#446a76"
            }
          },
          axisLabel: {
            show: true,
            color: '#446a76',
            fontSize: 12,
            fontFamily: 'Source Han Sans CN-Normal',
            rotate: 45
          },
        },
        yAxis: [{
          type: 'value',
          name: legendData[0],
          boundaryGap: ['0%', '20%'],
          alignTicks: true,
          splitNumber: 5,
          max: 100,
          nameTextStyle: {
            color: '#446a76',
            fontSize: 13,
            fontFamily: 'Source Han Sans CN-Normal',
            align: "left",
            verticalAlign: "center",
          },
          axisLabel: {
            color: '#446a76',
            fontSize: 13,
            fontFamily: 'Source Han Sans CN-Normal',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(68, 106, 118, 0.5)',
              type: "dashed",
            }
          }
        },
        {
          type: 'value',
          name: legendData[1],
          position: "right",
          boundaryGap: ['0%', '20%'],
          alignTicks: true,
          splitNumber: 5,
          nameTextStyle: {
            color: '#82AFC6',
            fontSize: 13,
            fontFamily: 'Source Han Sans CN-Normal',
            align: "right",
            verticalAlign: "center",
          },
          axisLabel: {
            color: '#82AFC6',
            fontSize: 13,
            fontFamily: 'Source Han Sans CN-Normal',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(49, 218, 255, 0.5)',
              type: "dashed",
            }
          }
        }],
        series: [{
          type: 'bar',
          name: legendData[0],
          data: value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(210, 218, 243, 1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(230, 233, 243, 1)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: 26,
        },
        {
          name: legendData[1],
          type: 'line',
          data: quency,
          yAxisIndex: 1,
          symbolSize: 8, //标记的大小
          emphasis: {
            scale: 1.5
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(114, 124, 182, 0.3)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(47,145,255,0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
          },
          lineStyle: {
            color: "rgba(113, 128, 184, 1)",
            width: 2,
          },
          itemStyle: {
            //折线拐点标志的样式
            color: "rgba(147, 157, 241, 1)",
            borderColor: 'rgba(147, 157, 241, 1)',
            borderWidth: 2,
          },
          // smooth: true
        }, { // 滚动点
          type: 'lines',
          zIndex: 999,
          z: 999,
          yAxisIndex: 1,
          coordinateSystem: 'cartesian2d',
          polyline: true,
          smooth: true,
          effect: {
            show: true,
            trailLength: 0,
            period: 10, //光点滑动速度
            delay: 2000,
            symbol: 'circle',
            color: 'rgba(67, 106, 118, 1)',
            symbolSize: 8,
            shadowBlur: 10,
            shadowColor: 'rgba(67, 106, 118, 1)',
          },
          lineStyle: {
            show: false,
            opacity: 0
          },
          data: [{
            coords: subject.map((item, index) => {
              return ['' + subject[index], '' + quency?.[index]]
            })
          }]
        }]
      };
      chart?.setOption(option)
    }
    watchEffect(() => {
      update(props.value, props.quency, props.subject)
    })
    return () => (
      <div ref={refDiv} class={s.averagechart}></div>
    )
  }
})