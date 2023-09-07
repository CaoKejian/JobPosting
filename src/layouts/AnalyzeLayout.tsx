import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './TabsLayout.module.scss';
import { Tab, Tabs } from '../shared/Tabs';
import { BackIcon } from '../shared/BackIcon';
import { MainLayout } from './MainLayout';
import { MenuBar } from './MenuBar';

const demo = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
})
export const AnalyzeLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true
    }
  },
  setup: (props, context) => {
    const refSelected = ref('周频率')
    const isBoolean = reactive({
      isShowMenu: false
    })
    return () => (
       <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isBoolean.isShowMenu = true}/>,
          title: () => '数据分析',
          default:() => <><div class={s.wrapper}>
            <Tabs v-model:selected={refSelected.value}
              rerenderOnSelect={true}>
              <Tab value='周频率' name='周频率'>
                <props.component
                  id={'0'}
                >
                </props.component>
              </Tab>
              <Tab value='擅长方向' name='擅长方向'>
                <props.component
                    id={'1'}
                  >
                </props.component>
              </Tab>
              <Tab value='提交习惯' name='提交习惯'>
                <props.component
                    id={'2'}
                  >
                </props.component>
              </Tab>
              <Tab value='相似性' name='相似性'>
                <props.component
                    id={'3'}
                  >
                </props.component>
              </Tab>
            </Tabs> 
          </div>
          {
            isBoolean.isShowMenu ?
            <MenuBar onClose={() => isBoolean.isShowMenu = false} />
            : null
          }</>
        }
      }</MainLayout>
     
    )
  }
})