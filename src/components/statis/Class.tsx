import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './Class.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { PeopleShow } from '../../shared/PeopleShow';
import { http } from '../../shared/Http';
import { Work } from '../../vite-env';
import { getAssetsFile } from '../../config/imgUtil';
import { Quote } from '../../shared/Quote';
import { Toast } from 'vant';
import { Time } from '../../shared/Time';
import { Button } from '../../shared/Button';
export const Class = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const branchArr = ref<{ value: string, text: string }[]>([])
    const workNumber = ref<number>(0)
    const workArr = ref<Work[]>([])
    // 未提交名单
    const unSubmit = ref<number[]>([])
    const work = ref<Work>({
      data: [],
      _id: '',
      name: '',
      stuId: 0,
      classId: 0,
      subject: '',
      time: 0,
      branch: '',
      file: {
        fileName: '',
        fileUrl: ''
      },
      favor: false,
      content: '',
      score: 0,
      tComments: '',
      isPass: false,
      user: '',
      cutTime: 0,
      __v: 0
    })
    const formData = reactive({
      branch: '',
      classId: 0
    })
    // 全班人员
    const classSubmitArr = ref<{ stuId: number, classId: number, isSubmit?: boolean }[]>([])
    const fetchClassPeople = async (classId: number) => {
      try {
        const data = await http.get<{ stuId: number, classId: number }[]>('/class', { classId }, { _autoLoading: true })
        console.log(data.data)
        classSubmitArr.value = data.data
      } catch (error) {
        classSubmitArr.value = []
      }
    }
    const fetchClassBranch = async (classId: number) => {
      try {
        const data = await http.get<Work[]>('/work/classwork', { classId }, { _autoLoading: true })
        workArr.value = data.data
        workNumber.value = workArr.value.length
        workArr.value.map(item => {
          const obj: { value: string, text: string } = { value: '', text: '' }
          obj.value = item._id
          obj.text = `${item.branch}「${item.subject}」-T${item.user}`
          branchArr.value.push(obj)
        })
        Toast.clear()
      } catch (error) {
        console.log(error)
      }
    }
    watch(() => formData.branch, async (newValue) => {
      try {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        const queryBranch = formData.branch.split('「')[0]
        const data = await http.get<Work>('/pub/subject/branch/info', {
          classId: formData.classId,
          branch: queryBranch
        })
        work.value = data.data
        const response = await http.get<{ stuId: number, classId: number }[]>('/work/class/allWork', {
          classId: formData.classId,
          branch: queryBranch
        })
        unSubmit.value = response.data.map(item => item.stuId)
        console.log(unSubmit.value)
        classSubmitArr.value = classSubmitArr.value.map(item => {
          const x = unSubmit.value.some(it => it === item.stuId)
          return { ...item, isSubmit: x }
        })
        Toast.clear()
      } catch (err: any) {
        Toast({ message: err })
      }
    })
    const onNotice = async () => {
      const stuIds = classSubmitArr.value.filter(item => item.isSubmit !== true).map(it => it.stuId)
      const data = await http.post('/user/email/unsubmit', { stuIds })
      console.log(data)
    }
    onMounted(async () => {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      formData.classId = Number(localStorage.getItem('classID')) || 0
      await fetchClassBranch(formData.classId)
      await fetchClassPeople(formData.classId)
    })
    return () => (
      <div class={s.content}>
        <p><Quote name={`近30天已有 ${workNumber.value} 份作业发布，请选择查看提交状态:`} /></p>
        <Form>
          <FormItem label='' type='select'
            options={branchArr.value} v-model={formData.branch}
          ></FormItem>
        </Form>
        <p><Quote name={'作业详情：'} /></p>
        {
          formData.branch !== '' ?
            <div class={s.detail}>
              <div class={s.left}>
                <div class={s.box}>
                  <span>作业分支</span>
                  <span>{work.value.branch}({work.value.subject})</span>
                </div>
                <div class={s.box}>
                  <span>截止时间</span>
                  <span>{Time(work.value.cutTime, 'YY-MM-SS')}</span>
                </div>
                <div class={s.box}>
                  <span>作业描述</span>
                  <span>{work.value.content}</span>
                </div>
              </div>
              <div class={s.right}>
                <div class={s.box}>
                  <span>发布者</span>
                  <span>{work.value.user}</span>
                </div>
              </div>
            </div> :
            <div class={s.empty}>
              <img src={`${getAssetsFile('empty.png')}`} alt="" />
            </div>
        }
        <p><Quote name={'全班提交情况:'} /></p>
        {
          formData.branch !== '' ? <>
            <PeopleShow array={classSubmitArr.value} />
            <div class={s.button}>
              <Button onClick={onNotice}>一键通知未交同学</Button>
            </div>
          </>
            :
            <div class={s.empty}>
              <img src={`${getAssetsFile('empty.png')}`} alt="" />
            </div>
        }
      </div>
    )
  }
})