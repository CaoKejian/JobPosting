export const Time = (time: number,format?:string) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 注意月份是从0开始的，所以需要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  // 使用模板字符串拼接时间格式
  const formattedTime = `${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  if(format === 'YY-MM-SS'){
    return `${month}月${day}日`;
  }
  return formattedTime;
}

