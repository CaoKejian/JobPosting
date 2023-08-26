import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Self.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { Toast } from 'vant';
import { getAssetsFile } from '../../config/imgUtil';
import { classMapFunction, nameMapFunction } from '../../config/NameMap';
import { http } from '../../shared/Http';
import { Work } from '../../vite-env';
import { Rules, hasError, validate } from '../../shared/Validate';
import { Time } from '../../shared/Time';
import { Quote } from '../../shared/Quote';
import { useRouter } from 'vue-router';

type formDataObj = {
  searchPeople: string
  isEmpty: boolean
  searchInfo: Work[] | null
  info: { name: string, classId?: number, stuId?: number}
}
export const Self = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const router = useRouter()
    const formData = reactive<formDataObj>({
      searchPeople: '2001063037',
      isEmpty: true,
      searchInfo: null,
      info: { name: '', classId: undefined, stuId: undefined }
    })
    const errors = reactive({
      searchPeople: []
    })
    const fetchWork = async (stuId: number | string) => {
      try {
        const data = await http.get<Work[]>('/work/mywork', {
          stuId,
        }, { _autoLoading: true })
        if (data.data.length === 0) {
          Object.assign(formData, {
            isEmpty: true,
            searchInfo: [],
            info: {}
          })
          Toast({
            message: '该同学没有提交！'
          })
          return
        }
        Object.assign(formData, {
          isEmpty: false,
          searchInfo: data.data,
          info: {
            subject:'',
            name: data.data[0].name,
            stuId: formData.searchPeople,
            classId: data.data[0].classId
          }
        })
      } catch (err) {
        Toast({ message: err as any })
      }
    }
    const isName = (name: string) => {
      return nameMapFunction(name)
    }
    const onSearch = () => {
      if (!/^\d+$/.test(formData.searchPeople)) {
        Object.assign(errors, {
          searchPeople: []
        })
        Object.assign(formData, {
          isEmpty: true,
          searchInfo: [],
          info: {}
        })
        const rules: Rules<typeof formData> = [
          { key: 'searchPeople', type: 'required', message: '必填' },
          { key: 'searchPeople', type: 'type', message: '该同学未录入，请填写学号查询' }
        ]
        Object.assign(errors, validate(formData, rules))
        if (!formData.searchPeople) {
          Toast({
            message: '搜索不能为空！'
          })
          return
        }
        if (!hasError(errors)) {
          fetchWork(isName(formData.searchPeople))
        }
      } else {
        if (!formData.searchPeople) {
          Toast({
            message: '搜索不能为空！'
          })
          return
        }
        fetchWork(formData.searchPeople)
      }

    }
    return () => (
      <div class={s.content}>
        <p><Quote name={'查询同学提交过的作业：'} /></p>
        <Form>
          <FormItem label='' type='search'
            onSearch={onSearch}
            v-model={formData.searchPeople}
            placeholder='学号/姓名'
            error={errors.searchPeople?.[0] ?? '　'}
          ></FormItem>
        </Form>
        {
          formData.isEmpty ?
            <div class={s.empty}>
              <img src={`${getAssetsFile('empty.png')}`} alt="" />
            </div> : <div class={s.list}>
              <div class={s.item}>
                <span class={s.info}>{formData.info?.name}-{formData.info.stuId}-{classMapFunction(formData.info.classId)}</span>
                <span>请核验信息！</span>
                <div class={s.itemList}>
                  {
                    formData.searchInfo?.length !== 0 ?
                      formData.searchInfo?.map((item, index) => {
                        return <div key={item._id} class={s.workList}>
                          <div class={s.workItem} onClick={() => router.push(`/student/view/${item._id}`)}>
                            <div class={s.index}>{index + 1}、</div>
                            <div class={s.workName}>{item.branch}</div>
                            <div class={s.subject}>「{item.subject}」 </div>
                            <span>T发布者</span>
                            <div class={s.time}>{Time(item.time, 'MM-SS-DD')}</div>
                          </div>
                        </div>
                      }) : <p class={s.infoEmpty}>暂无数据</p>
                  }
                </div>
              </div>
            </div>
        }

      </div>
    )
  }
})