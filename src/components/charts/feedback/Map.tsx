import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const Map = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    const xData = ref<string[]>([])
    const getXData = () => {
      var data = [];
      for (var i = 1; i < 13; i++) {
        data.push(i + "月份");
      }
      xData.value = data
      return data;
    }
    onMounted(async () => {
      getXData()
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      chart.setOption({
        backgroundColor: "#fff",
        title: {
          text: "本年交作业啦反馈",
          x: "4%",
          textStyle: {
            color: "#386b78",
            fontSize: "16",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          left: '12%',
          top: '12%',
          right: '4%',
          bottom: '12%',
          borderWidth: 0,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          x: "4%",
          top: "8%",
          textStyle: {
            color: "#90979c",
          },
          data: ["老师", "同学", "平均"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#90979c",
              },
            },
            axisLabel: {
              interval: 0,
            },
            data: xData.value,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#90979c",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            splitArea: {
              show: false,
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: {
              color: "#fff",
            },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: "老师",
            type: "bar",
            stack: "总量",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#fff",
                  },
                  position: "inside",
                  formatter: function (p:any) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: [
              709, 1917, 2455, 2610, 1719, 1433, 1544, 3285, 5208, 3372, 2484, 4078,
            ],
          },
          {
            name: "同学",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "inside",
                  formatter: function (p:any) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: [327, 1776, 507, 1200, 800, 482, 204, 1390, 1001, 951, 381, 220],
          },
          {
            name: "总数",
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter: function (p:any) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            data: [
              1036, 3693, 2962, 3810, 2519, 1915, 1748, 4675, 6209, 4323, 2865, 4298,
            ],
          },
        ],
      })
    })
    let chart: echarts.ECharts | undefined = undefined
    return () => (
      <div ref={refDiv} class={s.mapchart}></div>
    )
  }
})
