export const classMap: Record<number, string> = {
  123123: '大数据B201'
}

export const stuIdMap: Record<number, string> = {
  2001063037: '曹珂俭',
  2001062028: '黄梦瑶',
  2001062036: '蔡奇奇',
  2001062011: '捏于波',
  2001040023: '李梓良',
  2001063036: '张博涵',
  2001062067: '王硕',
}

export const teacherMao: Record<number,string> = {
  2001: '曹Sir'
}
export const stuIdMapFunction = (stuId: number) => {
  return stuIdMap[Number(stuId)] ? stuIdMap[Number(stuId)] : '未录入'
}
export const teacherMapFunction = (stuId: number) => {
  return teacherMao[Number(stuId)] ? teacherMao[Number(stuId)] : '未录入'
}

export const nameMapFunction = (name: string) => {
  for (const [stuId, stuName] of Object.entries(stuIdMap)) {
    if (stuName === name) {
      return stuId
    }
  }
  return '未录入'
}

export const classMapFunction = (classId?: number) => {
  return classMap[Number(classId)] ? classMap[Number(classId)] : '未录入'
}

export const classIdMapFunction = (className?: string) => {
  for (const [classId, claName] of Object.entries(classMap)) {
    if (claName === className) {
      return classId
    }
  }
  return '未录入'
}