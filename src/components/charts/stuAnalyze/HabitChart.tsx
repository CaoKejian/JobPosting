import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const HabitChart = defineComponent({
  props: {
    goodData: {
      type: Array as PropType<{ name: string, value: number[] }[]>,
      default:[]
    },
    typeArr: {
      type: Array as PropType<string[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      update(props.typeArr, props.goodData)
    })
    const update = (typeArr:string[],seriesData: { name: string, value: number[] }[]) => {
      chart?.setOption({
        title: {
          text: '提交习惯统计',
          fontSize: 12,
          fontWeight: "bold",
          color: '#446a76',
          left: 'center',
          top: '5%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '提交习惯',
              type: 'png',
            },
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              show: true,
              color: '#556677',
              borderColor: 'rgba(0,0,0,0)',
              shadowColor: 'rgba(0,0,0,0)',
              shadowOffsetY: 0
            },
            lineStyle: {
              width: 0
            }
          },
          color: '#5c6c7c',
          padding: [10, 10],
          extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
          formatter: function (params: any) {
            var maxSeriesToShow = 5;
            var seriesData = params.slice(0, maxSeriesToShow);
            var tooltipText = ''; // 最终的 tooltip 文本
            for (var i = 0; i < seriesData.length; i++) {
              var dataPoint = params[i];
              var percentageValue = (dataPoint.value * 100).toFixed(2) + '%';
              tooltipText += dataPoint.seriesName + ': ' + percentageValue + '<br>';
            }
            return `提交占个人比(展示五项)<br>${tooltipText}`;
          }
        },
        grid: {
          top: '15%',
          bottom: '12%'
        },
        xAxis: [{
          type: 'category',
          data: typeArr,
          axisLine: {
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#556677',
            fontSize: 12,
            margin: 15
          },
          axisPointer: {
            label: {
              padding: [0, 0, 10, 0],
              margin: 15,
              fontSize: 12,
              backgroundColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#fff' // 0% 处的颜色
                }, {
                  offset: 0.86,
                  color: '#fff' // 0% 处的颜色
                }, {
                  offset: 0.86,
                  color: '#33c0cd' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#33c0cd' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          boundaryGap: false
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          axisLabel: {
            color: '#556677'
          },
          splitLine: {
            show: false
          }
        }],
      })
      updateSeries(seriesData)
    }
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    const updateSeries = (data: { name: string, value: number[] }[]) => {
      const series: any[] = []
      data.map(item => {
        series.push(
          {
            name: item.name,
            type: 'line',
            data: item.value,
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: getRandomColor()
              },
              {
                offset: 1,
                color: getRandomColor()
              }
              ]),
              shadowColor: 'rgba(158,135,255, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
          }
        )
      })
      chart?.setOption({
        series: series
      })
    }
    watchEffect(() => {
      update(props.typeArr, props.goodData)
    })
    return () => (
      <div ref={refDiv} style={{marginBottom: '1rem'}} class={s.goodchart}></div>
    )
  }
})