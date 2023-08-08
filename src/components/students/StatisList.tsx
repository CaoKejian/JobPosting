import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './StatisList.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { Work } from '../../vite-env';
import { Loading } from '../../shared/Loading';
export const StatisList = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const active = ref<number>(1);
    const workNumber = ref<number>(0)
    const isShowDom = ref<boolean>(false)
    const formData = reactive({
      branch: ''
    })
    const branchArr = ref<{ value: string, text: string }[]>([])
    watch(() => formData.branch, (newValue) => {
      console.log(newValue);
    })
    const fetchMyData = async (id: string) => {
      try {
        const data = await http.get<Work[]>('/work/mywork', {
          stuId: id,
        }, { _autoLoading: true })
        console.log(data);
        workNumber.value = data.data.length
        const obj = data.data
        obj.map((item) => {
          const objItem: { value: string, text: string } = { value: '', text: '' }
          objItem.value = item.subject
          objItem.text = item.branch
          branchArr.value.push(objItem)
        })
        isShowDom.value = true
      } catch (error) {
      }
    }
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      fetchMyData(info.stuId)
    })
    return () => (<div class={s.wrapper}>
      {
        props.id === '0' ? (
          <div class={s.content}>
            {
              isShowDom.value ? <>
                <p>近30天已有 {workNumber.value} 份作业提交，请选择查看提交状态:</p>
                <Form>
                  <FormItem label='' type='select'
                    options={branchArr.value} v-model={formData.branch}
                  ></FormItem>
                </Form>
                {
                  formData.branch ?
                    <div class={s.steps}>
                      <van-steps active={active.value} style={{ background: '#d1daf5' }} active-icon="success" active-color='#386b78'>
                        <van-step>已提交</van-step>
                        <van-step>等候批改</van-step>
                        <van-step>老师点评</van-step>
                      </van-steps> 
                      <p>作业分支</p>
                      <p>提交文档：abc.doc 点击下载</p>
                      <p>提交时间</p>
                      <p>是否优秀</p>
                      <p>老师评语</p>
                      <p>最终得分</p>
                    </div> : <div class={s.steps}></div>
                }</> : <Loading visible={isShowDom.value}/>
            }
          </div>
        ) : props.id === '1' ? (
          <div>嘿嘿</div>
        ) : props.id === '2' ? (
          <div>呵呵</div>
        ) : props.id === '3' ? (
          <div>你好</div>
        ) : null
      }
    </div>
    )
  }
})

// 此页面为内容页面