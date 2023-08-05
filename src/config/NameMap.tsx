export const classMap: Record<number, string> = {
  123123 : '大数据B201'
}

export const stuIdMap: Record<number, string> = {
  2001063037 : '曹珂俭',
  2001062028 : '黄梦瑶',
}

export const stuIdMapFunction = (stuId:number) => {
  return  stuIdMap[Number(stuId)] ?  stuIdMap[Number(stuId)] : '未录入'
}