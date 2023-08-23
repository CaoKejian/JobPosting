import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';

type dataObj = {
  name: string, value: number
}
export const PieChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<dataObj[]>,
      default: [{
        name: "大数据",
        value: 54
      },
      {
        name: "智能",
        value: 11
      },
      {
        name: "计科",
        value: 20
      }]
    },
  },
  setup: (props, context) => {
    const dataSeries = ref<dataObj[]>([])
    dataSeries.value = props.data
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      updateChart(optionData.series)
      randomData()
    })
    const randomData = () => {
      const x = dataSeries.value
      x.forEach(item => {
        item.value = Math.floor(Math.random() * 100);
      });
      const temp = x[0];
      x[0] = x[1];
      x[1] = x[2];
      x[2] = temp;
      dataSeries.value = x
      return dataSeries.value
    }
    watchEffect(() => {
      const intervalId = setInterval(() => {
        randomData()
        const arrValue = getArrayValue(dataSeries.value, "value");
        const sumValue = eval(arrValue.join('+'));
        const optionData = getData(dataSeries.value, sumValue);
        updateChart(optionData.series)
      }, 2000);
      return () => {
        clearInterval(intervalId);
      };
    });
    const updateChart = (data: any) => {
      chart?.setOption({
        grid: {
          left: '8%',
          top: '6%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        backgroundColor: '#fff',
        legend: {
          show: true,
          icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          top: '8%',
          right: "2%",
          data: arrName,
          itemWidth: 17,
          itemHeight: 8,
          padding: [0, 16],
          itemGap: 10,
          orient: 'vertical',
          formatter: function (name: string) {
            return "{title|" + name + "}{value|" + (objData[name].value) + "}{title|项}"
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 14,
                lineHeight: 25,
                color: "#000"
              },
              value: {
                fontSize: 14,
                lineHeight: 20,
                color: "#386b78"
              }
            }
          },
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: ['#fc05f4', '#33d7d9', '#703bfd', '#de4841', '#5764f1'],
        xAxis: [{
          show: false
        }],
        series: data
      })
    }
    const getArrayValue = (array: dataObj[], key: string) => {
      var key = key || "value";
      var res: dataObj[] = [];
      if (array) {
        array.forEach(function (item: any) {
          res.push(item[key]);
        });
      }
      return res;
    }
    const getData = (data: any, sumValue: number) => {
      var res: any = {
        series: [],
        yAxis: []
      };
      for (let i = 0; i < data.length; i++) {
        res.series.push({
          name: '',
          type: 'pie',
          clockwise: false, //顺时加载
          emphasis: {
            scale: false // 鼠标移入缩放
          },
          radius: [60 - i * 15 + '%', 55 - i * 15 + '%'],
          startAngle: -90 * i, //起始角度
          center: ["45%", "55%"],
          label: {
            show: false,
            lineHeight: 40,
            formatter: '{b}\n\n{d}%',
            padding: [50, -60, 25, -60],
            fontSize: 12,
            color: "#386b78",
          },
          labelLine: {
            show: true,
            length: 40,
            length2: 50
          },
          itemStyle: {
            label: {
              show: true,
            },
            labelLine: {
              show: true
            },
            borderWidth: 5,
          },
          data: [{
            value: data[i].value,
            name: data[i].name
          }, {
            value: sumValue - data[i].value,
            name: '',
            itemStyle: {
              color: "rgba(0,0,0,0)",
              borderWidth: 0
            },
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            hoverAnimation: false
          }]
        });
      }
      return res;
    }
    const array2obj = (array: any, key: any) => {
      var resObj: any = {};
      for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    }

    const arrName = getArrayValue(dataSeries.value, "name");
    const objData = array2obj(dataSeries.value, "name");//alert(JSON.stringify(objData))
    const arrValue = getArrayValue(dataSeries.value, "value");
    const sumValue = eval(arrValue.join('+'));
    const optionData = getData(dataSeries.value, sumValue);
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    return () => (
      <div ref={refDiv} class={s.piechart}></div>
    )
  }
})