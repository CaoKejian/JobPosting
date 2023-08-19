import { PropType, defineComponent, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import s from './Correct.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { teacherIdMapFunction, classMapFunction, teacherMapFunction, classIdMapFunction, stuIdMapFunction } from '../../config/NameMap';
import { Class, ClassSelectItem, Resource, Work, WorkObj, pubWork } from '../../vite-env';
import { getAssetsFile } from '../../config/imgUtil';
import { Toast } from 'vant';
import { Button } from '../../shared/Button';
import { Time } from '../../shared/Time';
import { DownLoadInfo } from '../../shared/DownLoad';
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
      branch: ''
    })
    const workData = ref<WorkObj[]>([
      {
        _id: '123',
        stuId: 2001063037,
        classId: 123123,
        subject: '数据挖掘',
        time: 1692364849562,
        branch: '抖音数据挖掘',
        file: { fileName: '抖音..docx', fileUrl: '' },
        favor: false,
        content: '认真完成这一次作业',
        score: 0,
        tComments: '',
        isPass: false,
        publish: '曹Sir',
        cutTime: 1692364849563,
        __v: 123
      }
    ])
    const passData = ref({
      isPass: false,
      tComments: '',
      favor:false,
      score: null,
    })
    const errors = reactive({
      classId: [],
      branch: []
    })
    const fetchMyClass = async () => {
      try {
        const branchRes = await http.get<Work[]>('/pub/user', { user: formData.user })
        const branches = branchRes.data.map((item: any) => item = item.branch)
        branches.forEach((item, index) => {
          const subjectObj = {
            value: `${index} + 1`,
            text: item
          };
          subjectSelect.value.push(subjectObj);
        });
        const response = await http.get<Class>('/subject/myclass', { user: formData.user }, { _autoLoading: true })
        const data = response.data.classes
        data.forEach((item, index) => {
          const classObj = {
            value: `${index} + 1`,
            text: classMapFunction(item)
          };
          classSelect.value.push(classObj);
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
        const data = await http.get<Work[]>('/work/correct/work', {
          classId: classIdMapFunction(formData.classId), branch: formData.branch,
        }, { _autoLoading: true })
        console.log(data)
        workData.value = data.data
        Toast.clear()
      } catch (err) {
        console.log(err)
      }
    }
    watch(() => formData.branch, async (newValue) => {
      if (formData.classId === '') {
        Toast({ message: '请先选择班级！' })
        return
      }
      fetchMyClassWork()
    })
    const download = async (index: number) => {
      await DownLoadInfo(workData.value[index].file);
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    const next = () => {
      swipe.value.next()
    }
    const prev = () => {
      swipe.value.prev()
    }
    onMounted(() => {
      formData.user = teacherMapFunction(JSON.parse(localStorage.getItem('info') as string).stuId)
      fetchMyClass()
    })
    const swipe = ref()
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' />,
          title: () => '作业批改',
          default: () => <div class={s.container}>
            <div class={s.content}>
              <p><Quote name='批改作业' /></p>
              <Form>
                <FormItem label='请选择班级' type='select' v-model={formData.classId} options={classSelect.value} error={errors.classId?.[0] ?? '　'}>
                </FormItem>
                <FormItem label='请选择作业分支' type='select' v-model={formData.branch} options={subjectSelect.value} error={errors.branch?.[0] ?? '　'}>
                </FormItem>
              </Form>
            </div>
            <div class={s.data}>
              {
                workData.value.length === 0 ?
                  <div class={s.empty}>
                    <img src={`${getAssetsFile('empty.png')}`} alt="" />
                  </div> :
                  <div class={s.wrapper}>
                    <van-swipe class="my-swipe" loop={true} duration={1000}
                      indicator-color='#7580f5' ref={swipe}>
                      {
                        workData.value.map((item, index) => {
                          return (
                            <van-swipe-item key={index}>
                              {/* 预期否、打分、是否优秀、下一个【通过】）-已批12/61份未批 */}
                              <div class={s.box}>
                                <div class={s.top}>
                                  {item.time - item.cutTime >= 0 ?
                                    <span>未逾期</span> :
                                    <span class={s.overTime}>逾期</span>
                                  }
                                  <span>提交人：<span class={s.name}>{stuIdMapFunction(item.stuId)}</span></span>
                                </div>
                                <div class={s.center}>
                                  <div>
                                    <span>学号：</span>
                                    <span class={s.centerFont}>{item.stuId}</span>
                                  </div>
                                  <div>
                                    <span>提交时间：</span>
                                    <span class={s.centerFont}>{Time(item.time)}</span>
                                  </div>
                                </div>
                                <div class={s.file}>
                                  <span>上传文件：<span class={s.filename}>{item.file.fileName}</span></span>
                                  <Button onClick={() => download(index)}>下载</Button>
                                </div>
                                <div class={s.comment}>
                                  <Form>
                                    <FormItem label='评分' type='date' v-model={passData.value.tComments}></FormItem>
                                    <FormItem label='评语' type='text' v-model={passData.value.tComments}></FormItem>
                                  </Form>
                                </div>
                                <div class={s.controller}>
                                  <Button onClick={prev}>上一个</Button>
                                  <Button onClick={next} class={s.pass}>通过</Button>
                                </div>
                              </div>
                            </van-swipe-item>
                          )
                        })
                      }
                    </van-swipe>
                  </div>
              }
            </div></div>
        }
      }</MainLayout>
    )
  }
})