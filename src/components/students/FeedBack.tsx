import { defineComponent, onMounted, onUnmounted, reactive, ref, toRefs, watchEffect } from 'vue';
import s from './FeedBack.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { FeedBackObj } from '../../vite-env';
import { randomFn } from '../../config/utils';
import { Map } from '../charts/feedback/Map';
import { MenuBar } from '../../layouts/MenuBar';

interface UseDataObj {
  isLoading: boolean,
  feedArr: FeedBackObj[],
  page: number,
  isHaveData: boolean,
  formData: {
    email: string,
    name: string,
    stuId: string,
    feedBackValue: string,
  },
}
export const FeedBack = defineComponent({
  setup: (props, context) => {
    const isShowMenu = ref(false)
    const useData = reactive<UseDataObj>({
      isLoading: false,
      feedArr: [],
      page: 1,
      isHaveData: false,
      formData: {
        email: "",
        name: "",
        stuId: "",
        feedBackValue: '',
      },
    })
    const { isLoading, formData, feedArr, page, isHaveData } = toRefs(useData)
    const onSubmit = async () => {
      await http.post('/feedback/submit', { form: formData.value }, { _autoLoading: true })
      page.value = 1
      fetchFeedValue()
      formData.value.feedBackValue = ''
    }
    const fetchFeedValue = async () => {
      const data = await http.get<any>('/feedback', { page: page.value })
      const result = data.data
      if (result.pagination.totalPages === +result.pagination.currentPage) {
        page.value = 0
      }
      isHaveData.value = true
      feedArr.value = result.data
      feedArr.value.map(item => {
        item.randomMargin = randomFn(1, 6)
      })
    }
    watchEffect(() => {
      const intervalId = setInterval(() => {
        if (isHaveData.value) {
          page.value++;
          feedArr.value = [];
          fetchFeedValue();
        }
      }, 8000)
      return () => {
        clearInterval(intervalId)
      }
    })
    onMounted(() => {
      fetchFeedValue()
      const info = JSON.parse(localStorage.getItem('info') as string)
      Object.assign(formData.value, { name: info.name, email: info.email, stuId: info.stuId, })
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '反馈系统',
          default: () => <div class={s.wrapper}>
            <Quote name="您的反馈是我最大的动力！" />
            <div class={s.container}>
              <div class={s.feedback}>
                {feedArr.value.map(item => {
                  return <div key={item._id} class={s.ball} style={{ paddingLeft: item.randomMargin + 'rem' }}>
                    <svg class={s.svg}><use xlinkHref='#star'></use></svg>{item.name}：{item.feedBackValue}
                  </div>
                })}
              </div>
            </div>
            <div class={s.chart}>
              <Map />
            </div>
            <div class={s.submit}>
              <Form>
                <FormItem
                  label='' type='search'
                  placeholder='请输入反馈内容'
                  v-model={formData.value.feedBackValue}
                  srachValue={'提交'}
                  onClick={onSubmit}>
                </FormItem>
              </Form>
            </div>
            {isLoading.value ? <div class={s.icon}>
              <svg class={s.svg}><use xlinkHref='#feedback'></use></svg>
            </div> : null}
            {
              isShowMenu.value ?
                <MenuBar onClose={() => isShowMenu.value = false} />
                : null
            }
          </div>
        }
      }</MainLayout >
    )
  }
})

export default FeedBack