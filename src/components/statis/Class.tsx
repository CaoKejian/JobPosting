import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
import s from './Class.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { PeopleShow } from '../../shared/PeopleShow';
import { http } from '../../shared/Http';
export const Class = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const branchArr = ref<{ value: string, text: string }[]>([])
    const workNumber = ref<number>(0)
    const formData = reactive({
      branch: ''
    })
    const classSubmitArr = ref<{ stuId: number, classId: number }[]>([])
    onMounted(() => {
      const classId = localStorage.getItem('classID') || 0
      http.get('/class',{classId},{_autoLoading:true})
      classSubmitArr.value = [
        { stuId: 2001063037, classId: 123123},
        { stuId: 2001062028, classId: 123123},
      ]
    })
    return () => (
      <div class={s.content}>
        <p>近30天已有 {workNumber.value} 份作业发布，请选择查看提交状态:</p>
        <Form>
          <FormItem label='' type='select'
            options={branchArr.value} v-model={formData.branch}
          ></FormItem>
        </Form>
        <p>全班提交情况:</p>
        <PeopleShow array={classSubmitArr.value} />
      </div>
    )
  }
})