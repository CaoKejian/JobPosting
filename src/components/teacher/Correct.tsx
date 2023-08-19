import { PropType, defineComponent, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import s from './Correct.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { teacherIdMapFunction, classMapFunction, teacherMapFunction, classIdMapFunction } from '../../config/NameMap';
import { Class, ClassSelectItem, Resource, pubWork } from '../../vite-env';
import { getAssetsFile } from '../../config/imgUtil';
import { Toast } from 'vant';
export const Correct = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const classSelect = ref<ClassSelectItem[]>([])
    const subjectSelect = ref<ClassSelectItem[]>([])
    const formData = reactive({
      classId: '',
      user: '',
      subject: ''
    })
    const workData = ref<pubWork[]>([])
    const errors = reactive({
      classId: [],
      subject: []
    })
    const fetchMyClass = async () => {
      try {
        const response = await http.get<Class>('/subject/myclass', { user: formData.user }, { _autoLoading: true })
        const data = response.data.classes
        const subType = response.data.subjects
        data.forEach((item, index) => {
          const classObj = {
            value: `${index} + 1`,
            text: classMapFunction(item)
          };
          classSelect.value.push(classObj);
        });
        subType.forEach((item, index) => {
          const subjectObj = {
            value: `${index} + 1`,
            text: item
          };
          subjectSelect.value.push(subjectObj);
        });
      } catch (err) {
        console.log(err)
      }
    }
    const fetchMyClassWork = async () => {
      try {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
        })
        const data = await http.get<pubWork[]>('/subject/myclass/work', {
          classId: classIdMapFunction(formData.classId), subject: formData.subject,
          user: formData.user
        }, { _autoLoading: true })
        workData.value = data.data
        Toast.clear()
      } catch (err) {
        console.log(err)
      }
    }
    watch(() => formData.subject, async (newValue) => {
      fetchMyClassWork()
    })
    onMounted(() => {
      formData.user = teacherMapFunction(JSON.parse(localStorage.getItem('info') as string).stuId)
      fetchMyClass()
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' />,
          title: () => '作业批改',
          default: () => <div class={s.content}>
            <p><Quote name='批改作业' /></p>
            <Form>
              <FormItem label='请选择班级' type='select' v-model={formData.classId} options={classSelect.value} error={errors.classId?.[0] ?? '　'}>
              </FormItem>
              <FormItem label='请选择作业分支' type='select' v-model={formData.subject} options={subjectSelect.value} error={errors.subject?.[0] ?? '　'}>
              </FormItem>
            </Form>
            <div class={s.data}>
              {
                workData.value.length === 0 ?
                  <div class={s.empty}>
                    <img src={`${getAssetsFile('empty.png')}`} alt="" />
                  </div> :
                  <div class={s.wrapper}>
                    123
                  </div>
              }
            </div>
          </div>
        }
      }</MainLayout>
    )
  }
})