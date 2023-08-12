import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
import s from './My.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { Time } from '../../shared/Time';
import { Button } from '../../shared/Button';
import { Loading } from '../../shared/Loading';
import { Work } from '../../vite-env';
import { getAssetsFile } from '../../config/imgUtil';
import { http } from '../../shared/Http';

export const My = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const active = ref<number>(1);
    const isShowDom = ref<boolean>(false)
    const workNumber = ref<number>(0)
    const workObj = ref<Work>()
    const branchArr = ref<{ value: string, text: string }[]>([])
    const formData = reactive({
      branch: ''
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
        workObj.value = data.data[0]
        console.log(workObj.value);
        isShowDom.value = true
      } catch (error) {
      }
    }
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      fetchMyData(info.stuId)
    })
    return () => (
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
                <div class={s.homework}>
                  <div class={s.head}>
                    <p class={s.time}>{Time(workObj.value?.time||0,'YY-MM-SS')}</p>
                    <p class={s.name}>{workObj.value?.branch}</p>
                    <p class={s.score}>{workObj.value?.score}</p>
                  </div>
                  <div class={s.body}>
                    <div>
                      <p>老师评语:</p>
                      <div class={s.tComments}>{workObj.value?.tComments || '暂无'}</div>
                    </div>
                  </div>
                  <div class={s.foot}>
                    <p class={s.file}>
                      <span>文件：{workObj.value?.file.fileName}</span>
                    </p>
                    {workObj.value?.favor ?
                      <img class={s.good}  src={`${getAssetsFile('award.png')}`} alt="" />
                      : null
                    }
                  </div>
                  <Button>点击下载</Button>
                </div>
              </div> : <div class={s.steps}></div>
          }</> : <Loading visible={isShowDom.value} />
      }
    </div>
    )
  }
})