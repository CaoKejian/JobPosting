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
export const TabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true
    }
  },
  setup: (props, context) => {
    const refSelected = ref('自定义')
    const isBoolean = reactive({
      isShowMenu: false
    })
    return () => (
       <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isBoolean.isShowMenu = true}/>,
          title: () => '作业统计',
          default:() => <><div class={s.wrapper}>
            <Tabs v-model:selected={refSelected.value}
              rerenderOnSelect={true}>
              <Tab value='我的' name='我的'>
                <props.component
                  id={'0'}
                >
                </props.component>
              </Tab>
              <Tab value='班级' name='班级'>
                <props.component
                    id={'1'}
                  >
                </props.component>
              </Tab>
              <Tab value='全校的' name='全校的'>
                <props.component
                    id={'2'}
                  >
                </props.component>
              </Tab>
              <Tab value='自定义' name='自定义'>
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