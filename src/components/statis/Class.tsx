import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
import s from './Class.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { PeopleShow } from '../../shared/PeopleShow';
import { http } from '../../shared/Http';
import { Work } from '../../vite-env';
export const Class = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const branchArr = ref<{ value: string, text: string }[]>([])
    const workNumber = ref<number>(0)
    const page = ref<number>(1)
    const formData = reactive({
      branch: ''
    })
    const classSubmitArr = ref<{ stuId: number, classId: number }[]>([])
    const fetchClassPeople = async (classId: number) => {
      try {
        const data = await http.get<{ stuId: number, classId: number }[]>('/class', { classId }, { _autoLoading: true })
        classSubmitArr.value = data.data
      } catch (error) {
        classSubmitArr.value = []
      }
    }
    const fetchClassBranch = async (classId: number) => {
      try {
        console.log('发送班级作业信息总分支请求')
      } catch (error) {
        console.log(error)
      }
    }
    onMounted(async () => {
      const classId = Number(localStorage.getItem('classID')) || 0
      fetchClassBranch(classId)
      fetchClassPeople(classId)
    })
    return () => (
      <div class={s.content}>
        <p>近30天已有 {workNumber.value} 份作业发布，请选择查看提交状态:</p>
        <Form>
          <FormItem label='' type='select'
            options={branchArr.value} v-model={formData.branch}
          ></FormItem>
        </Form>
        <p>作业详情：</p>
        <div class={s.detail}>
          <div class={s.left}>
            <div class={s.box}>
              <span>作业分支</span>
              <span>组件 （所属：React）</span>
            </div>
            <div class={s.box}>
              <span>截止时间</span>
              <span>2023/09/12</span>
            </div>
            <div class={s.box}>
              <span>作业描述</span>
              <span>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
            </div>
          </div>
          <div class={s.right}>
            <div class={s.box}>
              <span>发布者</span>
              <span>xxx</span>
            </div>
          </div>

        </div>
        <p>全班提交情况:</p>
        <PeopleShow array={classSubmitArr.value} />
      </div>
    )
  }
})