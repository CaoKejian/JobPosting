import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './Publish.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { Rules, hasError, validate } from '../../shared/Validate';
import { http } from '../../shared/Http';
import { Timestamp } from '../../shared/Time';
import { Class, pubWork } from '../../vite-env';
import { Toast } from 'vant';
import { Quote } from '../../shared/Quote';
import { useInfoStore } from '../../store/useInfoStore';
import { Model } from '../../shared/Model';
export const Publish = defineComponent({
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const isShowMenu = ref<boolean>(false)
    const isShowVisible = ref<boolean>(false)
    const classId = ref('')
    const selectData = reactive<{
      classMap: { value: string, text: string }[],
      subjectMap: { value: string, text: string }[],
      branchMap: { value: string, text: string }[]
    }>({
      classMap: [],
      subjectMap: [],
      branchMap: [
        { value: '1', text: '组件定义' },
        { value: '2', text: '抖音数据分析' },
      ]
    })
    const formData = reactive<pubWork>({
      user: '',
      classId: '',
      subject: '',
      branch: '',
      cutTime: undefined,
      content: ''
    })
    const errors = reactive({
      classId: [],
      subject: [],
      branch: [],
      cutTime: [],
      content: []
    })
    watch(() => formData.classId, async (newValue) => {
      if (!formData.classId || !isNaN(+formData.classId)) return
      fetchSubjectData(await infoStore.classIdMapFunction(formData.classId), formData.user)
    })
    const fetchSubjectData = async (classId: string, user: string) => {
      selectData.subjectMap = []
      try {
        const data = await http.get<Class>('/subject/myAll/subject', { classId, user }, { _autoLoading: true })
        const subjects = data.data.subjects
        subjects.forEach((item, index) => {
          const subjectObj = {
            value: `${index} + 1`,
            text: item
          };
          selectData.subjectMap.push(subjectObj);
        });
        if (data.data.subjects.length !== 0) {
          formData.subject = selectData.subjectMap[0].text
        }
      } catch (err) {
        console.log(err)
      }
    }
    const fetchAddClass = async (stuId: number, name: string) => {
      try {
        await http.post('/class/insert', {
          stuId,
          name,
          type: true
        })
      } catch (err) {
        console.log(err)
      }
    }
    const setClassMapSelection = () => {
      for (const [value, text] of Object.entries(infoStore.class)) {
        selectData.classMap.unshift({ value, text })
      }
      formData.classId = selectData.classMap[0].text
    }
    onMounted(async () => {
      //* 判断是否有权限 * //
      const info = JSON.parse(localStorage.getItem('info') as string)
      const classId = JSON.parse(localStorage.getItem('classID') as string)
      if(!classId){
       isShowVisible.value= true
      }
      formData.user = info.name
      await setClassMapSelection()
      fetchAddClass(info.stuId, info.name)
    })
    const onChangeModel = async(value1:string,value2:number) => {
      if(value2===1){
        localStorage.setItem('classID', classId.value)
      }
    }
    const publish = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, { classId: [], subject: [], branch: [], cutTime: [], content: [] })
      const rules: Rules<typeof formData> = [
        { key: 'classId', type: 'required', message: '必须选择班级' },
        { key: 'subject', type: 'required', message: '必须选择学科' },
        { key: 'branch', type: 'required', message: '必须选择作业分支' },
        { key: 'cutTime', type: 'required', message: '必须选择截止日期' },
      ]
      Object.assign(errors, validate(formData, rules))
      if (!hasError(errors)) {
        formData.cutTime = Timestamp(String(formData.cutTime))
        formData.classId = await infoStore.classIdMapFunction(String(formData.classId))
        try {
          await http.post('/pub', formData, { _autoLoading: true })
          Object.assign(formData, { classId: selectData.classMap[0].text, subject: selectData.classMap[0].text, cutTime: '', content: '', branch: '' })
          Toast({
            message: '发布成功！'
          })
        } catch (err: any) {
          if (err.response?.status === 402) {
            Object.assign(formData, { classId: selectData.classMap[0].text, subject: selectData.classMap[0].text, cutTime: '', content: '', branch: '' })
            Toast({
              message: err.response.data.message
            })
          }
        }
      }
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '发布作业',
          default: () => <div class={s.content}>
            <p><Quote name='发布作业' /></p>
            <Form>
              <FormItem label='班级' type='select'
                options={selectData.classMap}
                v-model={formData.classId}
                error={errors.classId?.[0] ?? '　'}>
              </FormItem>
              <FormItem label='学科' type='select'
                options={selectData.subjectMap}
                v-model={formData.subject}
                error={errors.subject?.[0] ?? '　'}>
              </FormItem>
              <FormItem label='分支' type='text'
                v-model={formData.branch}
                placeholder='请填写要发布的作业名称'
                error={errors.branch?.[0] ?? '　'} >
              </FormItem>
              <FormItem label='截止时间'
                v-model={formData.cutTime} type='date'
                error={errors.cutTime?.[0] ?? '　'}
              ></FormItem>
              <FormItem label='作业描述' type='text'
                placeholder='「可选」填写作业描述'
                v-model={formData.content} >
              </FormItem>
              <div class={s.button}>
                <Button onClick={publish}>发布作业</Button>
              </div>
            </Form>
            {
              isShowMenu.value ?
                <MenuBar name={'teacher'} onClose={() => isShowMenu.value = false} />
                : null
            }
            {isShowVisible.value ?
              <Model v-model:modelVisible={isShowVisible.value}
                onUpdate:modelVisible={onChangeModel}
                v-model:classId={classId.value}
                isShowForm={true}
              >{
                {
                  title:() => '请填写班级码',
                }
              }</Model> : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})